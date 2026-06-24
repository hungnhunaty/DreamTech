using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BE.Model;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.AiF
{
    public class AiService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AiService(AppDbContext dbContext, IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _dbContext = dbContext;
            _config = config;
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<string> SuggestBuildAsync(string userPrompt)
        {
            // 1. Lấy danh sách sản phẩm linh kiện PC đang bán từ DB
            var products = await _dbContext.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive && p.Quantity > 0)
                .Select(p => new
                {
                    p.ProductId,
                    p.Name,
                    CategoryName = p.Category.Name,
                    p.Price,
                    p.DiscountPrice,
                    p.Brand
                })
                .ToListAsync();

            var productListJson = JsonSerializer.Serialize(products);

            // 2. Tạo prompt gửi cho Gemini
            var systemPrompt = $@"Bạn là chuyên gia tư vấn build PC tại cửa hàng DreamTech.Dưới đây là danh sách sản phẩm đang có trong kho:

                {productListJson}

                Nhiệm vụ: Dựa vào yêu cầu của khách hàng, hãy gợi ý cấu hình PC phù hợp.QUY TẮC BẮT BUỘC:
                - CHỈ được chọn sản phẩm có trong danh sách trên (dùng đúng productId).- Trả về kết quả theo ĐÚNG format JSON sau, KHÔNG thêm markdown hay text nào khác:
                {{
                ""components"": [
                    {{""productId"": <id>, ""componentType"": ""CPU"", ""reason"": ""<lý do chọn>""}},
                    {{""productId"": <id>, ""componentType"": ""Mainboard"", ""reason"": ""<lý do chọn>""}},
                    {{""productId"": <id>, ""componentType"": ""RAM"", ""reason"": ""<lý do chọn>""}},
                    {{""productId"": <id>, ""componentType"": ""VGA"", ""reason"": ""<lý do chọn>""}},
                    {{""productId"": <id>, ""componentType"": ""SSD"", ""reason"": ""<lý do chọn>""}},
                    {{""productId"": <id>, ""componentType"": ""PSU"", ""reason"": ""<lý do chọn>""}},
                    {{""productId"": <id>, ""componentType"": ""Case"", ""reason"": ""<lý do chọn>""}},
                    {{""productId"": <id>, ""componentType"": ""Tản nhiệt"", ""reason"": ""<lý do chọn>""}}
                ],
                ""totalPrice"": <tổng giá>,
                ""summary"": ""<tóm tắt cấu hình và nhận xét chung>""
                }}
                - Nếu danh mục nào không có sản phẩm phù hợp, bỏ qua danh mục đó.- reason phải ngắn gọn, dễ hiểu, bằng tiếng Việt.- Ưu tiên sản phẩm có discountPrice (giá khuyến mãi) nếu có.";

            // 3. Gọi Google Gemini API
            var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY") 
                ?? _config["GeminiApi:ApiKey"];
            var modelName = Environment.GetEnvironmentVariable("GEMINI_MODEL")
                ?? _config["GeminiApi:Model"] 
                ?? "gemini-2.5-flash";
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}";

            string responseBody = "";
            HttpResponseMessage response = null;
            bool isSuccess = false;

            int maxRetries = 3;
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var requestBody = new
                    {
                        contents = new[]
                        {
                            new
                            {
                                parts = new[]
                                {
                                    new { text = systemPrompt + "\n\nYêu cầu của khách hàng: " + userPrompt }
                                }
                            }
                        },
                        generationConfig = new
                        {
                            temperature = 0.2,
                            maxOutputTokens = 8192,
                            responseMimeType = "application/json",
                            responseSchema = new
                            {
                                type = "OBJECT",
                                properties = new
                                {
                                    components = new
                                    {
                                        type = "ARRAY",
                                        items = new
                                        {
                                            type = "OBJECT",
                                            properties = new
                                            {
                                                productId = new { type = "INTEGER" },
                                                componentType = new { type = "STRING" },
                                                reason = new { type = "STRING" }
                                            },
                                            required = new[] { "productId", "componentType", "reason" }
                                        }
                                    },
                                    totalPrice = new { type = "NUMBER" },
                                    summary = new { type = "STRING" }
                                },
                                required = new[] { "components", "totalPrice", "summary" }
                            }
                        }
                    };

                    var json = JsonSerializer.Serialize(requestBody);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    response = await _httpClient.PostAsync(url, content);
                    responseBody = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        isSuccess = true;
                        break;
                    }

                    if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable ||
                        (int)response.StatusCode == 429)
                    {
                        if (attempt < maxRetries)
                        {
                            await Task.Delay(1000 * attempt);
                            continue;
                        }
                    }
                    else
                    {
                        break;
                    }
                }
                catch (Exception)
                {
                    if (attempt < maxRetries)
                    {
                        await Task.Delay(1000 * attempt);
                        continue;
                    }
                }
            }

            if (!isSuccess)
            {
                throw new Exception($"Gemini API error: {responseBody}");
            }

            // 4. Parse response từ Gemini
            using var doc = JsonDocument.Parse(responseBody);
            var textResult = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return textResult ?? "";
        }
    }
}

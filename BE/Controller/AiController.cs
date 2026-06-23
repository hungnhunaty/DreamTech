using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Services.AiF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly AiService _aiService;
        public AiController(AiService aiService)
        {
            _aiService = aiService;
        }

        [Authorize]
        [HttpPost("suggest-build")]
        public async Task<IActionResult> SuggestBuild([FromBody] AiSuggestRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Prompt))
                {
                    return BadRequest(new { message = "Vui lòng nhập yêu cầu cấu hình!" });
                }

                var result = await _aiService.SuggestBuildAsync(request.Prompt);
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi AI: " + ex.Message });
            }
        }
    }

    public class AiSuggestRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}

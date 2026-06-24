using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using BE.Dtos;
using BE.Model;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace BE.Services.ProductF
{
    public class ProductService
    {
        private readonly AppDbContext _dbContext;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Cloudinary? _cloudinary;

        public ProductService(
            AppDbContext dbContext, 
            IWebHostEnvironment env, 
            IHttpContextAccessor httpContextAccessor,
            Cloudinary? cloudinary = null)
        {
            _dbContext = dbContext;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
            _cloudinary = cloudinary;
        }

        private string GetBaseUrl()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            return $"{request?.Scheme}://{request?.Host}";
        }

        private async Task<string> UploadImageAsync(IFormFile file)
        {
            if (_cloudinary != null)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "dreamtech_products"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult?.SecureUrl != null)
                {
                    return uploadResult.SecureUrl.ToString();
                }
            }

            // Fallback to local disk if Cloudinary is not configured
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(_env.WebRootPath, "images", "products", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return $"{GetBaseUrl()}/images/products/{fileName}";
        }

        public async Task<bool> AddProductAsync(AddProductDto newProduct)
        {
            var existsProduct = await _dbContext.Products.AnyAsync(p => p.Name == newProduct.Name);
            if(existsProduct is true)
            {
                return false;
            }

            string imageUrl = "";
            if (newProduct.Image != null)
            {
                imageUrl = await UploadImageAsync(newProduct.Image);
            }

            var addProduct = new Product
            {
                CategoryId = newProduct.CategoryId,
                Name = newProduct.Name,
                Description = newProduct.Description,
                Price = newProduct.Price,
                Quantity = newProduct.Quantity,
                Brand = newProduct.Brand,
                ImageUrl = imageUrl
            };

            try
            {
                await _dbContext.Products.AddAsync(addProduct);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private string NormalizeImageUrl(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return "";
            
            // Nếu ảnh cũ lưu dạng localhost:5149, chuyển thành URL của Render hiện tại
            if (imageUrl.Contains("localhost:5149"))
            {
                return imageUrl.Replace("http://localhost:5149", GetBaseUrl());
            }
            
            return imageUrl;
        }

        public async Task<List<GetProductDto>> GetAllProducts()
        {
            var products = await _dbContext.Products
                        .Include(p => p.Category)
                        .ToListAsync();

            var data = products.Select(p => new GetProductDto(
                            p.ProductId,
                            p.CategoryId,
                            p.Name,
                            p.Description,
                            p.Category.Name,
                            p.Price,
                            p.DiscountPrice,
                            p.Quantity,
                            p.Brand,
                            NormalizeImageUrl(p.ImageUrl),
                            p.IsActive,
                            p.CreatedAt
                        ))
                        .ToList();

            return data;
        }

        public async Task<bool> DeleteProductById(int id)
        {
            try
            {
                var delProduct = await _dbContext.Products.FindAsync(id);
                if(delProduct is null)
                {
                    return false;
                }
                _dbContext.Products.Remove(delProduct);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> UpdateProduct(UpdateProductDto updateProduct)
        {
            var currentProduct = await _dbContext.Products.FindAsync(updateProduct.productId);

            if (currentProduct is null)
            {
                return false;
            }

            if (updateProduct.Image != null)
            {
                currentProduct.ImageUrl = await UploadImageAsync(updateProduct.Image);
            }

            currentProduct.CategoryId = updateProduct.categoryId;
            currentProduct.Name = updateProduct.name;
            currentProduct.Description = updateProduct.description;
            currentProduct.Price = updateProduct.price;
            currentProduct.DiscountPrice = updateProduct.discountPrice;
            currentProduct.Quantity = updateProduct.quantity;
            currentProduct.Brand = updateProduct.brand;
            currentProduct.IsActive = updateProduct.isActive;

            try
            {
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Model;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.ProductF
{
    public class ProductService
    {
        private readonly AppDbContext _dbContext;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductService(AppDbContext dbContext, IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetBaseUrl()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            return $"{request?.Scheme}://{request?.Host}";
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
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(newProduct.Image.FileName);
                var filePath = Path.Combine(_env.WebRootPath, "images", "products", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await newProduct.Image.CopyToAsync(stream);
                }
                imageUrl = $"{GetBaseUrl()}/images/products/{fileName}";
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

        public async Task<List<GetProductDto>> GetAllProducts()
        {
            var data = await _dbContext.Products
                        .Include(p => p.Category)
                        .Select(p => new GetProductDto(
                            p.ProductId,
                            p.CategoryId,
                            p.Name,
                            p.Description,
                            p.Category.Name,
                            p.Price,
                            p.DiscountPrice,
                            p.Quantity,
                            p.Brand,
                            p.ImageUrl,
                            p.IsActive,
                            p.CreatedAt
                        ))
                        .ToListAsync();

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
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(updateProduct.Image.FileName);
                var filePath = Path.Combine(_env.WebRootPath, "images", "products", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await updateProduct.Image.CopyToAsync(stream);
                }
                currentProduct.ImageUrl = $"{GetBaseUrl()}/images/products/{fileName}";
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
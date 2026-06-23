using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Services.ProductF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {   
        private readonly ProductService _productService;
        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("addProduct")]
        public async Task<IActionResult> AddNewProduct([FromForm] AddProductDto _newProduct)
        {
            try
            {
                var result = await _productService.AddProductAsync(_newProduct);

                if(result == false)
                {
                    return BadRequest(new {message = "Sản phẩm đã tồn tại!"});
                }
                return Ok(new {message = "Thêm sản phẩm thành công!"});    
            }
            catch(Exception ex)
            {
                return BadRequest(new {message = "Error: " + ex.Message});
            }
            
        }

        [AllowAnonymous]
        [HttpGet("getProduct")]
        public async Task<IActionResult> GetProducts()
        {
            var data = await _productService.GetAllProducts();
            return Ok(data);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("deleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProductById(id);
            if(result == false)
            {
                return BadRequest(new {message = "Sản phẩm không tồn tại"});
            }
            return Ok(new {message = "Xóa sản phẩm thành công"});
        }

        [Authorize(Roles = "admin")]
        [HttpPut("updateProduct")]
        public async Task<IActionResult> UpdateProduct([FromForm] UpdateProductDto updateProduct)
        {
            var result = await _productService.UpdateProduct(updateProduct);
            if(result == false)
            {
                return BadRequest(new {message = "Cập nhật không thành công"});
            }
            return Ok(new {message = "Cập nhật sản phẩm thành công"});
        }
    }
}
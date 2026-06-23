using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Services.CategoryF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BE.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("addCategory")]
        public async Task<IActionResult> AddNewCategory(AddCategoryDto newCategory)
        {
            var result = await _categoryService.AddNewCategory(newCategory);
            if(result == false)
            {
                return BadRequest(new {message = "Danh mục đã tồn tại"});
            }
            return Ok(new {message = "Thêm danh mục thành công"});
        }

        [AllowAnonymous]
        [HttpGet("getCategory")]
        public async Task<IActionResult> GetAllCategories()
        {
            var data = await _categoryService.GetAllCategories();
            return Ok(data);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("deleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategoryById(id);
            if(result == false)
            {
                return BadRequest(new {message = "Danh mục không tồn tại hoặc đang có sản phẩm được trưng bày"});
            }
            return Ok(new {message = "Xóa danh mục thành công"});
        }

        [Authorize(Roles = "admin")]
        [HttpPut("updateCategory")]
        public async Task<IActionResult> UpdateCategory(UpdateCategoryDto updateCategory)
        {
            var result = await _categoryService.UpdateCategoryById(updateCategory);
            if(result == false)
            {
                return BadRequest(new {message = "Cập nhật không thành công"});
            }
            return Ok(new {message = "Cập nhật danh mục thành công"});
        }
    }
}
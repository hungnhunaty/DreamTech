using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Model;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.CategoryF
{
    public class CategoryService
    {
        private readonly AppDbContext _dbContext;
        public CategoryService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddNewCategory(AddCategoryDto newCategory)
        {
            var existsCategory = await _dbContext.Categories.AnyAsync(c => c.Name == newCategory.Name);

            if(existsCategory is true)
            {
                return false;
            }

            var addCategory = new Category
            {
                Name = newCategory.Name,
                Description = newCategory.Description
            };

            try
            {
                await _dbContext.Categories.AddAsync(addCategory);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<GetCategoryDto>> GetAllCategories()
        {
            var data = await _dbContext.Categories.Select(c => new GetCategoryDto
            (
                c.CategoryId,
                c.Name,
                c.Description,
                c.Products.Count()
            )).ToListAsync();

            return data;
        }

        public async Task<bool> DeleteCategoryById(int id)
        {
            bool hasProducts = await _dbContext.Products.AnyAsync(p => p.CategoryId == id);

            if (hasProducts)
            {
                return false;
            }

            try
            {
                var delCategory = await _dbContext.Categories.FindAsync(id);
                if(delCategory is null)
                {
                    return false;
                }
                _dbContext.Categories.Remove(delCategory);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> UpdateCategoryById(UpdateCategoryDto updateCategory)
        {
            var currentCategory = await _dbContext.Categories.FindAsync(updateCategory.categoryId);

            if (currentCategory is null)
            {
                return false;
            }

            
            currentCategory.Name = updateCategory.name;
            currentCategory.Description = updateCategory.description;

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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Model;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.ReviewF
{
    public class ReviewService
    {
        private readonly AppDbContext _dbContext;
        public ReviewService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<GetReviewDto>> GetAllReviews()
        {
            var data = await _dbContext.Reviews
                        .Include(r => r.User)
                        .Include(r => r.Product)
                        .OrderByDescending(r => r.CreatedAt)
                        .Select(r => new GetReviewDto(
                            r.ReviewId,
                            r.User.FullName,
                            r.Product.Name,
                            r.Rating,
                            r.Comment,
                            r.CreatedAt
                        ))
                        .ToListAsync();

            return data;
        }

        public async Task<bool> DeleteReviewById(int id)
        {
            try
            {
                var delReview = await _dbContext.Reviews.FindAsync(id);
                if(delReview is null)
                {
                    return false;
                }
                _dbContext.Reviews.Remove(delReview);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<GetReviewDto>> GetReviewsByProductId(int productId)
        {
            var data = await _dbContext.Reviews
                        .Include(r => r.User)
                        .Include(r => r.Product)
                        .Where(r => r.ProductId == productId)
                        .OrderByDescending(r => r.CreatedAt)
                        .Select(r => new GetReviewDto(
                            r.ReviewId,
                            r.User.FullName,
                            r.Product.Name,
                            r.Rating,
                            r.Comment,
                            r.CreatedAt
                        ))
                        .ToListAsync();

            return data;
        }

        public async Task<bool> AddReview(AddReviewDto reviewDto)
        {
            var hasOrdered = await _dbContext.Orders
                .AnyAsync(o => o.UserId == reviewDto.UserId && o.OrderDetails.Any(d => d.ProductId == reviewDto.ProductId));
            if (!hasOrdered)
            {
                throw new InvalidOperationException("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng!");
            }

            var review = new Review
            {
                UserId = reviewDto.UserId,
                ProductId = reviewDto.ProductId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                await _dbContext.Reviews.AddAsync(review);
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Services.ReviewF;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("getReviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            var data = await _reviewService.GetAllReviews();
            return Ok(data);
        }

        [HttpDelete("deleteReview/{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var result = await _reviewService.DeleteReviewById(id);
            if(result == false)
            {
                return BadRequest(new {message = "Đánh giá không tồn tại"});
            }
            return Ok(new {message = "Xóa đánh giá thành công"});
        }

        [HttpGet("getReviewsByProduct/{productId}")]
        public async Task<IActionResult> GetReviewsByProduct(int productId)
        {
            var data = await _reviewService.GetReviewsByProductId(productId);
            return Ok(data);
        }

        [HttpPost("addReview")]
        public async Task<IActionResult> AddReview(AddReviewDto reviewDto)
        {
            try
            {
                var result = await _reviewService.AddReview(reviewDto);
                if (result == false)
                {
                    return BadRequest(new { message = "Gửi đánh giá không thành công." });
                }
                return Ok(new { message = "Gửi đánh giá thành công!" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

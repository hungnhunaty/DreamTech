using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Services.CouponF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly CouponService _couponService;

        public CouponController(CouponService couponService)
        {
            _couponService = couponService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("addCoupon")]
        public async Task<IActionResult> AddNewCoupon(AddCouponDto newCoupon)
        {
            var result = await _couponService.AddNewCoupon(newCoupon);
            if(result == false)
            {
                return BadRequest(new {message = "Mã khuyến mãi đã tồn tại"});
            }
            return Ok(new {message = "Thêm mã khuyến mãi thành công"});
        }

        [AllowAnonymous]
        [HttpGet("getCoupons")]
        public async Task<IActionResult> GetAllCoupons()
        {
            var data = await _couponService.GetAllCoupons();
            return Ok(data);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("deleteCoupon/{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var result = await _couponService.DeleteCouponById(id);
            if(result == false)
            {
                return BadRequest(new {message = "Mã khuyến mãi không tồn tại"});
            }
            return Ok(new {message = "Xóa mã khuyến mãi thành công"});
        }

        [Authorize(Roles = "admin")]
        [HttpPut("updateCoupon")]
        public async Task<IActionResult> UpdateCoupon(UpdateCouponDto updateCoupon)
        {
            var result = await _couponService.UpdateCoupon(updateCoupon);
            if(result == false)
            {
                return BadRequest(new {message = "Cập nhật không thành công"});
            }
            return Ok(new {message = "Cập nhật mã khuyến mãi thành công"});
        }
    }
}

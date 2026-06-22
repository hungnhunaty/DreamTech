using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Model;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.CouponF
{
    public class CouponService
    {
        private readonly AppDbContext _dbContext;
        public CouponService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddNewCoupon(AddCouponDto newCoupon)
        {
            var existsCoupon = await _dbContext.Coupons.AnyAsync(c => c.Code == newCoupon.Code);

            if(existsCoupon is true)
            {
                return false;
            }

            var addCoupon = new Coupon
            {
                Code = newCoupon.Code,
                Description = newCoupon.Description,
                DiscountType = newCoupon.DiscountType,
                DiscountValue = newCoupon.DiscountValue,
                MinOrderAmount = newCoupon.MinOrderAmount,
                MaxDiscountAmount = newCoupon.MaxDiscountAmount,
                UsageLimit = newCoupon.UsageLimit,
                StartDate = newCoupon.StartDate,
                EndDate = newCoupon.EndDate
            };

            try
            {
                await _dbContext.Coupons.AddAsync(addCoupon);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<GetCouponDto>> GetAllCoupons()
        {
            var data = await _dbContext.Coupons.Select(c => new GetCouponDto(
                c.CouponId,
                c.Code,
                c.Description,
                c.DiscountType,
                c.DiscountValue,
                c.MinOrderAmount,
                c.MaxDiscountAmount,
                c.UsageLimit,
                c.UsedCount,
                c.StartDate,
                c.EndDate,
                c.IsActive,
                c.CreatedAt
            )).ToListAsync();

            return data;
        }

        public async Task<bool> DeleteCouponById(int id)
        {
            try
            {
                var delCoupon = await _dbContext.Coupons.FindAsync(id);
                if(delCoupon is null)
                {
                    return false;
                }
                _dbContext.Coupons.Remove(delCoupon);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> UpdateCoupon(UpdateCouponDto updateCoupon)
        {
            var currentCoupon = await _dbContext.Coupons.FindAsync(updateCoupon.couponId);

            if (currentCoupon is null)
            {
                return false;
            }

            currentCoupon.Code = updateCoupon.code;
            currentCoupon.Description = updateCoupon.description;
            currentCoupon.DiscountType = updateCoupon.discountType;
            currentCoupon.DiscountValue = updateCoupon.discountValue;
            currentCoupon.MinOrderAmount = updateCoupon.minOrderAmount;
            currentCoupon.MaxDiscountAmount = updateCoupon.maxDiscountAmount;
            currentCoupon.UsageLimit = updateCoupon.usageLimit;
            currentCoupon.StartDate = updateCoupon.startDate;
            currentCoupon.EndDate = updateCoupon.endDate;
            currentCoupon.IsActive = updateCoupon.isActive;

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

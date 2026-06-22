using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record GetCouponDto
    (
        int couponId,
        string code,
        string description,
        string discountType,
        decimal discountValue,
        decimal minOrderAmount,
        decimal? maxDiscountAmount,
        int usageLimit,
        int usedCount,
        DateTime startDate,
        DateTime endDate,
        bool isActive,
        DateTime createdAt
    );

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record UpdateCouponDto
    (
        int couponId,
        string code,
        string description,
        string discountType,
        decimal discountValue,
        decimal minOrderAmount,
        decimal? maxDiscountAmount,
        int usageLimit,
        DateTime startDate,
        DateTime endDate,
        bool isActive
    );

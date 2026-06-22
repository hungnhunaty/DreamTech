using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record AddCouponDto
    (
        string Code,
        string Description,
        string DiscountType,
        decimal DiscountValue,
        decimal MinOrderAmount,
        decimal? MaxDiscountAmount,
        int UsageLimit,
        DateTime StartDate,
        DateTime EndDate
    );

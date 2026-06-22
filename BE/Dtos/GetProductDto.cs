using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record GetProductDto
    (
        int productId,
        int categoryId,
        string name,
        string description,
        string categoryName,
        decimal price,
        decimal? discountPrice,
        int quantity,
        string brand,
        string imageUrl,
        bool isActive,
        DateTime createdAt
    );

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record GetReviewDto
    (
        int reviewId,
        string userName,
        string productName,
        int rating,
        string comment,
        DateTime createdAt
    );

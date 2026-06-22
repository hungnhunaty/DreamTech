using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos
{
    public record UpdateCategoryDto
    (
        int categoryId,
        string name,
        string description
    );
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record AddCategoryDto
    (
        string Name,
        string Description
    );

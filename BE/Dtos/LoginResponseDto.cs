using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;
    public record LoginResponseDto(
        int UserId,
        string FullName,
        string Role,
        string Token
    );

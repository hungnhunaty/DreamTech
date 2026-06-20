using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record AccountRegisterDto
    (
        string FullName,
        string Username,
        string Password,
        string Phone,
        string? Address
    );

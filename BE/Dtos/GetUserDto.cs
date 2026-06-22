using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record GetUserDto
    (
        int userID,
        string username,
        string fullName,
        string email,
        string phone,
        string? address,
        string role,
        DateTime createdAt
    );

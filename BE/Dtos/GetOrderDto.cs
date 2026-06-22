using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record GetOrderDto
    (
        int orderId,
        string receiverName,
        string phone,
        string address,
        decimal totalAmount,
        decimal discountAmount,
        string status,
        DateTime createdAt,
        string paymentMethod,
        string paymentStatus
    );

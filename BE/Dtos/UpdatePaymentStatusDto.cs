using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public record UpdatePaymentStatusDto
    (
        int orderId,
        string paymentStatus
    );

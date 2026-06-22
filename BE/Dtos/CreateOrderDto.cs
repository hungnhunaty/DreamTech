using System;
using System.Collections.Generic;

namespace BE.Dtos
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public int? CouponId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "COD";
        public List<CreateOrderDetailDto> OrderItems { get; set; } = new();
    }

    public class CreateOrderDetailDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}

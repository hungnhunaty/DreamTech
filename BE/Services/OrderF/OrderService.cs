using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Model;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.OrderF
{
    public class OrderService
    {
        private readonly AppDbContext _dbContext;
        public OrderService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<GetOrderDto>> GetAllOrders()
        {
            var data = await _dbContext.Orders
                        .Include(o => o.Payment)
                        .OrderByDescending(o => o.CreatedAt)
                        .Select(o => new GetOrderDto(
                            o.OrderId,
                            o.ReceiverName,
                            o.Phone,
                            o.Address,
                            o.TotalAmount,
                            o.DiscountAmount,
                            o.Status,
                            o.CreatedAt,
                            o.Payment != null ? o.Payment.Method : "Chưa có",
                            o.Payment != null ? o.Payment.Status : "Chưa có"
                        ))
                        .ToListAsync();

            return data;
        }

        public async Task<List<GetOrderDto>> GetOrdersByUserId(int userId)
        {
            var data = await _dbContext.Orders
                        .Include(o => o.Payment)
                        .Where(o => o.UserId == userId)
                        .OrderByDescending(o => o.CreatedAt)
                        .Select(o => new GetOrderDto(
                            o.OrderId,
                            o.ReceiverName,
                            o.Phone,
                            o.Address,
                            o.TotalAmount,
                            o.DiscountAmount,
                            o.Status,
                            o.CreatedAt,
                            o.Payment != null ? o.Payment.Method : "Chưa có",
                            o.Payment != null ? o.Payment.Status : "Chưa có"
                        ))
                        .ToListAsync();

            return data;
        }

        public async Task<bool> UpdateOrderStatus(UpdateOrderStatusDto updateOrder)
        {
            var currentOrder = await _dbContext.Orders
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.OrderId == updateOrder.orderId);

            if (currentOrder is null)
            {
                return false;
            }

            currentOrder.Status = updateOrder.status;

            // Automatically update payment status based on order status changes
            if (currentOrder.Payment != null)
            {
                string statusLower = updateOrder.status.ToLower();
                if (statusLower == "completed" || statusLower == "processing" || statusLower == "shipping" || statusLower == "approved")
                {
                    currentOrder.Payment.Status = "Paid";
                    currentOrder.Payment.PaidAt = DateTime.UtcNow;
                }
                else if (statusLower == "canceled" || statusLower == "cancelled")
                {
                    currentOrder.Payment.Status = "Canceled";
                }
            }

            try
            {
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> UpdatePaymentStatus(UpdatePaymentStatusDto updatePayment)
        {
            var currentOrder = await _dbContext.Orders
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.OrderId == updatePayment.orderId);

            if (currentOrder is null || currentOrder.Payment is null)
            {
                return false;
            }

            currentOrder.Payment.Status = updatePayment.paymentStatus;
            if (updatePayment.paymentStatus.Equals("Paid", StringComparison.OrdinalIgnoreCase) ||
                updatePayment.paymentStatus.Equals("Đã thanh toán", StringComparison.OrdinalIgnoreCase))
            {
                currentOrder.Payment.PaidAt = DateTime.UtcNow;
            }
            else
            {
                currentOrder.Payment.PaidAt = null;
            }

            try
            {
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<(bool Success, string Message)> CreateOrder(CreateOrderDto orderDto)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // Cập nhật số lần sử dụng của coupon
                if (orderDto.CouponId.HasValue && orderDto.CouponId.Value > 0)
                {
                    var coupon = await _dbContext.Coupons.FindAsync(orderDto.CouponId.Value);
                    if (coupon != null)
                    {
                        if (coupon.UsageLimit > 0 && coupon.UsedCount >= coupon.UsageLimit)
                        {
                            return (false, "Mã giảm giá đã đạt giới hạn sử dụng!");
                        }
                        
                        var now = DateTime.UtcNow;
                        if (!coupon.IsActive || now < coupon.StartDate || now > coupon.EndDate)
                        {
                            return (false, "Mã giảm giá đã hết hạn hoặc không hoạt động!");
                        }

                        coupon.UsedCount += 1;
                    }
                }

                var order = new Order
                {
                    UserId = orderDto.UserId,
                    CouponId = orderDto.CouponId,
                    TotalAmount = orderDto.TotalAmount,
                    DiscountAmount = orderDto.DiscountAmount,
                    Status = "Pending",
                    ReceiverName = orderDto.ReceiverName,
                    Phone = orderDto.Phone,
                    Address = orderDto.Address,
                    CreatedAt = DateTime.UtcNow
                };

                await _dbContext.Orders.AddAsync(order);
                await _dbContext.SaveChangesAsync(); // Generates OrderId

                // Save OrderDetails and update product quantities
                foreach (var item in orderDto.OrderItems)
                {
                    var product = await _dbContext.Products.FindAsync(item.ProductId);
                    if (product == null || product.Quantity < item.Quantity)
                    {
                        return (false, $"Sản phẩm '{(product != null ? product.Name : "không xác định")}' không đủ hàng trong kho!");
                    }

                    product.Quantity -= item.Quantity; // Deduct quantity

                    var detail = new OrderDetail
                    {
                        OrderId = order.OrderId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    };
                    await _dbContext.OrderDetails.AddAsync(detail);
                }

                // Add Payment
                var payment = new Payment
                {
                    OrderId = order.OrderId,
                    Amount = orderDto.TotalAmount,
                    Method = orderDto.PaymentMethod,
                    Status = orderDto.PaymentMethod == "Bank Transfer" ? "Chờ xác nhận" : "Unpaid",
                    PaidAt = null
                };
                await _dbContext.Payments.AddAsync(payment);

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
                return (true, "Đặt hàng thành công!");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, ex.Message);
            }
        }

        public async Task<bool> HasUserOrderedProduct(int userId, int productId)
        {
            return await _dbContext.Orders
                .AnyAsync(o => o.UserId == userId && o.OrderDetails.Any(d => d.ProductId == productId));
        }

        public async Task<List<GetOrderDetailDto>> GetOrderDetailsByOrderId(int orderId)
        {
            return await _dbContext.OrderDetails
                .Include(d => d.Product)
                .Where(d => d.OrderId == orderId)
                .Select(d => new GetOrderDetailDto(
                    d.ProductId,
                    d.Product.Name,
                    d.Product.ImageUrl,
                    d.Quantity,
                    d.UnitPrice
                ))
                .ToListAsync();
        }

    }
};

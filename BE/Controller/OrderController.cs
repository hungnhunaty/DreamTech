using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Services.OrderF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("getOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var data = await _orderService.GetAllOrders();
            return Ok(data);
        }

        [Authorize]
        [HttpPost("createOrder")]
        public async Task<IActionResult> CreateOrder(CreateOrderDto orderDto)
        {
            var (success, message) = await _orderService.CreateOrder(orderDto);
            if (!success)
            {
                return BadRequest(new { message = message });
            }
            return Ok(new { message = message });
        }

        [Authorize]
        [HttpGet("getOrdersByUser/{userId}")]
        public async Task<IActionResult> GetOrdersByUser(int userId)
        {
            var data = await _orderService.GetOrdersByUserId(userId);
            return Ok(data);
        }

        [Authorize]
        [HttpGet("hasOrdered/{userId}/{productId}")]
        public async Task<IActionResult> HasOrdered(int userId, int productId)
        {
            var result = await _orderService.HasUserOrderedProduct(userId, productId);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("getOrderDetails/{orderId}")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            var data = await _orderService.GetOrderDetailsByOrderId(orderId);
            return Ok(data);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("updateStatus")]
        public async Task<IActionResult> UpdateOrderStatus(UpdateOrderStatusDto updateOrder)
        {
            var result = await _orderService.UpdateOrderStatus(updateOrder);
            if(result == false)
            {
                return BadRequest(new {message = "Cập nhật trạng thái không thành công"});
            }
            return Ok(new {message = "Cập nhật trạng thái đơn hàng thành công"});
        }

        [Authorize(Roles = "admin")]
        [HttpPut("updatePaymentStatus")]
        public async Task<IActionResult> UpdatePaymentStatus(UpdatePaymentStatusDto updatePayment)
        {
            var result = await _orderService.UpdatePaymentStatus(updatePayment);
            if (result == false)
            {
                return BadRequest(new { message = "Cập nhật trạng thái thanh toán không thành công" });
            }
            return Ok(new { message = "Cập nhật trạng thái thanh toán thành công" });
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Services.OrderF;
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

        [HttpGet("getOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var data = await _orderService.GetAllOrders();
            return Ok(data);
        }

        [HttpPost("createOrder")]
        public async Task<IActionResult> CreateOrder(CreateOrderDto orderDto)
        {
            var result = await _orderService.CreateOrder(orderDto);
            if (result == false)
            {
                return BadRequest(new { message = "Đặt hàng không thành công. Vui lòng kiểm tra lại tồn kho!" });
            }
            return Ok(new { message = "Đặt hàng thành công!" });
        }

        [HttpGet("getOrdersByUser/{userId}")]
        public async Task<IActionResult> GetOrdersByUser(int userId)
        {
            var data = await _orderService.GetOrdersByUserId(userId);
            return Ok(data);
        }

        [HttpGet("hasOrdered/{userId}/{productId}")]
        public async Task<IActionResult> HasOrdered(int userId, int productId)
        {
            var result = await _orderService.HasUserOrderedProduct(userId, productId);
            return Ok(result);
        }

        [HttpGet("getOrderDetails/{orderId}")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            var data = await _orderService.GetOrderDetailsByOrderId(orderId);
            return Ok(data);
        }

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

    }
}

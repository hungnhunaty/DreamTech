using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Model;
using BE.Services.Account;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BE.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class AccountController : ControllerBase
    {

        private readonly AccountService _accountService;
        public AccountController(AccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> createAccount(AccountRegisterDto account)
        {
            try
            {
                bool result = await _accountService.CreateUserAccountAsync(account);

                if (!result)
                {
                    return BadRequest(new {message = "Tên tài khoản đã tồn tại, vui lòng nhập lại."});
                }

                return Ok(new {message = "Đăng ký thành công!"});
            }
            catch(Exception ex)
            {
                return BadRequest(new {message = "Error: " + ex.Message});
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> loginAccount(AccountLoginDto accountLoginDto)
        {
            try
            {
                var checkLogin = await _accountService.CheckLoginAsync(accountLoginDto);

                if(checkLogin is null)
                {
                    return BadRequest(new {message = "Tài khoản hoặc mật khẩu không chính xác!"});
                }
                return Ok(checkLogin);
            }
            catch(Exception ex)
            {
                return BadRequest(new {message = "Error: " + ex.Message});
            }
        }

        [HttpGet("getUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var data = await _accountService.GetAllUsers();
            return Ok(data);
        }

        [HttpDelete("deleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _accountService.DeleteUserById(id);
            if(result == false)
            {
                return BadRequest(new {message = "Không thể xóa tài khoản này"});
            }
            return Ok(new {message = "Xóa tài khoản thành công"});
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Dtos;
using BE.Model;
using BE.Services.JWT;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Account
{
    public class AccountService
    {
        private readonly AppDbContext _dbContext;
        private readonly TokenProvider _tokenProvider;

        public AccountService(AppDbContext dbContext, TokenProvider tokenProvider)
        {
            _dbContext = dbContext;
            _tokenProvider = tokenProvider;
        }

        public async Task<bool> CreateUserAccountAsync(AccountRegisterDto newAccount)
        {
            if (string.IsNullOrEmpty(newAccount.Phone))
            {
                throw new Exception("Số điện thoại là bắt buộc");
            }

            bool accountExist = await _dbContext.Users.AnyAsync(u => u.Username == newAccount.Username);

            if (accountExist)
            {
                return false;
            }

            var newUser = new User
            {
                Username = newAccount.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(newAccount.Password),
                FullName = newAccount.FullName,
                Phone = newAccount.Phone,
                Address = newAccount.Address,

                Role = "User"
            };

            try
            {
                await _dbContext.Users.AddAsync(newUser);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch(Exception)
            {
                return false;
            }
        }


        public async Task<LoginResponseDto> CheckLoginAsync(AccountLoginDto accountLoginDto)
        {
            var curAccount = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == accountLoginDto.Username);

            if(curAccount is null || !BCrypt.Net.BCrypt.Verify(accountLoginDto.Password, curAccount.Password))
            {
                return null;
            }

            string token = _tokenProvider.Create(curAccount);

            return new LoginResponseDto
            (
                curAccount.UserID,
                curAccount.FullName,
                curAccount.Role,
                token
            );
        }

        public async Task<bool> SeedAdminAsync()
        {
            var curAdmin = await _dbContext.Users.AnyAsync(u => u.Role == "Admin");
            if(curAdmin is false)
            {
                var admin = new User
                {
                    FullName = "admin",
                    Username = "admin",
                    Password = BCrypt.Net.BCrypt.HashPassword("admin"),
                    Email = "AdminDreamTech@gmail.com",
                    CreatedAt = DateTime.UtcNow,
                    Role = "admin"
                };

                await _dbContext.Users.AddAsync(admin);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            return false;
        }

        public async Task<List<GetUserDto>> GetAllUsers()
        {
            var data = await _dbContext.Users.Select(u => new GetUserDto(
                u.UserID,
                u.Username,
                u.FullName,
                u.Email,
                u.Phone,
                u.Address,
                u.Role,
                u.CreatedAt
            )).ToListAsync();

            return data;
        }

        public async Task<bool> DeleteUserById(int id)
        {
            try
            {
                var delUser = await _dbContext.Users.FindAsync(id);
                if(delUser is null)
                {
                    return false;
                }

                // Không cho phép xóa tài khoản Admin
                if(delUser.Role.ToLower() == "admin")
                {
                    return false;
                }

                _dbContext.Users.Remove(delUser);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
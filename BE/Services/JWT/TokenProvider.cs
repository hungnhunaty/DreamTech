using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BE.Model;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace BE.Services.JWT
{
    public class TokenProvider(IConfiguration configuration, AppDbContext dbContext)
    {

        public string Create(User user)
        {
            string secretKey = configuration["JWTConfig:SecretKey"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            string roleName = user.Role;

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                    new Claim("Role", roleName)
                }),

                Expires = DateTime.UtcNow.AddMinutes(double.Parse(configuration["JWTConfig:ExpirationInMinutes"] ?? "60")),
                SigningCredentials = credentials,
                Issuer = configuration["JWTConfig:Issuer"],
                Audience = configuration["JWTConfig:Audience"]
            };

            var tokenHandler = new JsonWebTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return token;
        }
    }
}
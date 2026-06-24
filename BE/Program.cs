using System.Text;
using BE.Model;
using BE.Services.Account;
using BE.Services.AiF;
using BE.Services.CategoryF;
using BE.Services.CouponF;
using BE.Services.JWT;
using BE.Services.OrderF;
using BE.Services.ProductF;
using BE.Services.ReviewF;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;


using CloudinaryDotNet;


var builder = WebApplication.CreateBuilder(args);

// Cloudinary Configuration
var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME") ?? builder.Configuration["Cloudinary:CloudName"];
var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") ?? builder.Configuration["Cloudinary:ApiKey"];
var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") ?? builder.Configuration["Cloudinary:ApiSecret"];

if (!string.IsNullOrEmpty(cloudName) && !string.IsNullOrEmpty(apiKey) && !string.IsNullOrEmpty(apiSecret))
{
    var cloudinaryAccount = new Account(cloudName, apiKey, apiSecret);
    var cloudinary = new Cloudinary(cloudinaryAccount);
    builder.Services.AddSingleton(cloudinary);
}


// Read allowed origins from environment variable or fallback to localhost
var allowedOrigins = builder.Configuration["AllowedOrigins"]
    ?? Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")
    ?? "http://localhost:4200";

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins(allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries));
    });
});


// Use connection string from environment variable if available, otherwise fallback to appsettings
var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("ConStr");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
        ?? builder.Configuration["JWTConfig:SecretKey"]!;
    var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
        ?? builder.Configuration["JWTConfig:Issuer"];
    var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
        ?? builder.Configuration["JWTConfig:Audience"];

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
        RoleClaimType = "Role"
    };
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();

builder.Services.AddScoped<TokenProvider>();
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<CouponService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<AiService>();
builder.Services.AddHttpClient();

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var accountService = services.GetRequiredService<AccountService>();

        await accountService.SeedAdminAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error while seeding Admin: " + ex.Message);
    }
}


app.UseStaticFiles();
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();

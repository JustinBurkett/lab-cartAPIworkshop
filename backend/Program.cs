using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Models;
using BuckeyeMarketplace.Services;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FluentValidation;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
});

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=buckeye.db"));

builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddDefaultTokenProviders();

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT signing key missing. Set it with: dotnet user-secrets set \"Jwt:Key\" \"<your-long-random-key>\"");
}

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "BuckeyeMarketplace";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "BuckeyeMarketplaceClient";
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = signingKey,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1)
    };

    options.Events = new JwtBearerEvents
    {
        OnChallenge = async context =>
        {
            context.HandleResponse();

            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { message = "Unauthorized." });
            }
        },
        OnForbidden = async context =>
        {
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { message = "Forbidden." });
            }
        }
    };
});

builder.Services.AddAuthorization();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();
// Add Swagger portal services
builder.Services.AddEndpointsApiExplorer();

// Configure CORS to allow requests from Azure Static Web Apps and local development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://salmon-sand-05c6f240f.7.azurestaticapps.net",
            "http://localhost:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .SetIsOriginAllowed(_ => true);
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    if (dbContext.Database.IsRelational())
    {
        dbContext.Database.Migrate();
    }
    else
    {
        dbContext.Database.EnsureCreated();
    }

    if (!dbContext.Products.Any())
    {
        dbContext.Products.AddRange(
            new Product { Id = 1, Title = "Engineering Lab Manual", Description = "Slightly used, vital for ENGR 1181.", Price = 45.00m, StockQuantity = 5, Category = "Textbooks", SellerName = "Brutus", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=1" },
            new Product { Id = 2, Title = "Scarlet Quarter-Zip", Description = "Size Large, very comfy.", Price = 35.00m, StockQuantity = 0, Category = "Clothing", SellerName = "Cassie", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=2" },
            new Product { Id = 3, Title = "Graphing Calculator", Description = "TI-84 Plus, works great.", Price = 80.00m, StockQuantity = 4, Category = "Electronics", SellerName = "Thomas", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=3" },
            new Product { Id = 4, Title = "Oval Picnic Blanket", Description = "Perfect for study sessions on the grass.", Price = 15.00m, StockQuantity = 6, Category = "Other", SellerName = "Sarah", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=4" },
            new Product { Id = 5, Title = "Noise Cancelling Headphones", Description = "Great for Thompson Library sessions.", Price = 120.00m, StockQuantity = 2, Category = "Electronics", SellerName = "Alex", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=5" },
            new Product { Id = 6, Title = "Chemistry Goggles", Description = "Still in original packaging.", Price = 10.00m, StockQuantity = 12, Category = "Textbooks", SellerName = "Mike", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=6" },
            new Product { Id = 7, Title = "Buckeye Beanie", Description = "Keeps you warm during the Michigan game.", Price = 20.00m, StockQuantity = 8, Category = "Clothing", SellerName = "Elena", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=7" },
            new Product { Id = 8, Title = "Used Mini-Fridge", Description = "Fits perfectly in Morrill Tower dorms.", Price = 50.00m, StockQuantity = 3, Category = "Electronics", SellerName = "David", PostedDate = DateTime.UtcNow, ImageUrl = "https://picsum.photos/200?random=8" }
        );

        dbContext.SaveChanges();
    }
    else if (dbContext.Products.All(p => p.StockQuantity == 0))
    {
        var stockById = new Dictionary<int, int>
        {
            [1] = 5,
            [2] = 0,
            [3] = 4,
            [4] = 6,
            [5] = 2,
            [6] = 12,
            [7] = 8,
            [8] = 3,
        };

        foreach (var product in dbContext.Products)
        {
            if (stockById.TryGetValue(product.Id, out var stock))
            {
                product.StockQuantity = stock;
            }
        }

        dbContext.SaveChanges();
    }

    await SeedAdminUserAsync(userManager, roleManager);
}



app.UseSwaggerUI();

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    context.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();



app.Run();

static async Task SeedAdminUserAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
{
    const string adminRoleName = "Admin";
    const string userRoleName = "User";
    const string adminEmail = "admin@buckeyemarketplace.local";
    const string adminPassword = "Admin1234";

    if (!await roleManager.RoleExistsAsync(adminRoleName))
    {
        var roleResult = await roleManager.CreateAsync(new IdentityRole(adminRoleName));
        if (!roleResult.Succeeded)
        {
            throw new InvalidOperationException("Failed to create Admin role.");
        }
    }

    if (!await roleManager.RoleExistsAsync(userRoleName))
    {
        var userRoleResult = await roleManager.CreateAsync(new IdentityRole(userRoleName));
        if (!userRoleResult.Succeeded)
        {
            throw new InvalidOperationException("Failed to create User role.");
        }
    }

    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser is null)
    {
        adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(adminUser, adminPassword);
        if (!createResult.Succeeded)
        {
            var errors = string.Join(", ", createResult.Errors.Select(error => error.Description));
            throw new InvalidOperationException($"Failed to seed admin user: {errors}");
        }
    }

    if (!await userManager.IsInRoleAsync(adminUser, adminRoleName))
    {
        var addRoleResult = await userManager.AddToRoleAsync(adminUser, adminRoleName);
        if (!addRoleResult.Succeeded)
        {
            var errors = string.Join(", ", addRoleResult.Errors.Select(error => error.Description));
            throw new InvalidOperationException($"Failed to assign admin role: {errors}");
        }
    }
}

public partial class Program
{
}

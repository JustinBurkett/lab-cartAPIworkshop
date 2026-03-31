using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Models;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=buckeye.db"));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();
// Add Swagger portal services
builder.Services.AddEndpointsApiExplorer();


// Configure CORS to allow React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

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
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();



app.Run();

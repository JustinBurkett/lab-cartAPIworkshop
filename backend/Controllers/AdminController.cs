using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Dtos;
using BuckeyeMarketplace.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplace.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(AppDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<OrderResponse>>> GetAllOrders()
    {
        var orders = await _dbContext.Orders
            .Include(order => order.Items)
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();

        var responses = orders.Select(order => new OrderResponse
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderDate = order.OrderDate,
            ConfirmationNumber = order.ConfirmationNumber,
            ShippingAddress = order.ShippingAddress,
            Total = order.Total,
            Status = order.Status,
            Items = order.Items.Select(item => new OrderItemResponse
            {
                ProductId = item.ProductId,
                ProductTitle = item.ProductTitle,
                UnitPrice = item.UnitPrice,
                Quantity = item.Quantity
            }).ToList()
        });

        return Ok(responses);
    }

    [HttpGet("products")]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        var products = await _dbContext.Products
            .OrderBy(product => product.Title)
            .ToListAsync();

        return Ok(products);
    }

    [HttpPost("products")]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] UpsertProductRequest request)
    {
        var product = new Product
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            Category = request.Category.Trim(),
            SellerName = request.SellerName.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            PostedDate = DateTime.UtcNow
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllProducts), new { id = product.Id }, product);
    }

    [HttpPut("products/{id:int}")]
    public async Task<ActionResult<Product>> UpdateProduct([FromRoute] int id, [FromBody] UpsertProductRequest request)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
        {
            return NotFound();
        }

        product.Title = request.Title.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.Category = request.Category.Trim();
        product.SellerName = request.SellerName.Trim();
        product.ImageUrl = request.ImageUrl.Trim();

        await _dbContext.SaveChangesAsync();

        return Ok(product);
    }

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct([FromRoute] int id)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
        {
            return NotFound();
        }

        _dbContext.Products.Remove(product);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<object>>> GetUsers()
    {
        var users = await _userManager.Users.OrderBy(u => u.Email).ToListAsync();
        var result = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new
            {
                user.Id,
                user.Email,
                Roles = roles
            });
        }

        return Ok(result);
    }
}

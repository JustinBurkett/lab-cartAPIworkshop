using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Dtos;
using BuckeyeMarketplace.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuckeyeMarketplace.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize(Roles = "User,Admin")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public OrdersController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<OrderResponse>>> GetMyOrders()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized(new { message = "Missing user claim in token." });
        }

        var orders = await _dbContext.Orders
            .Include(order => order.Items)
            .Where(order => order.UserId == currentUserId)
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(MapOrderResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderResponse>> GetOrderById([FromRoute] int id)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized(new { message = "Missing user claim in token." });
        }

        var order = await _dbContext.Orders
            .Include(item => item.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null)
        {
            return NotFound();
        }

        if (order.UserId != currentUserId && !User.IsInRole("Admin"))
        {
            return Forbid();
        }

        return Ok(MapOrderResponse(order));
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized(new { message = "Missing user claim in token." });
        }

        var cart = await _dbContext.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == currentUserId);

        if (cart is null || cart.Items.Count == 0)
        {
            return BadRequest(new { message = "Cannot place an order with an empty cart." });
        }

        foreach (var item in cart.Items)
        {
            if (item.Product.StockQuantity < item.Quantity)
            {
                return BadRequest(new { message = $"Insufficient stock for product {item.Product.Title}." });
            }
        }

        var order = new Order
        {
            UserId = currentUserId,
            OrderDate = DateTime.UtcNow,
            ConfirmationNumber = GenerateConfirmationNumber(),
            ShippingAddress = request.ShippingAddress.Trim(),
            Status = "Placed",
            Total = cart.Items.Sum(item => item.Product.Price * item.Quantity),
            Items = cart.Items
                .Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductTitle = item.Product.Title,
                    UnitPrice = item.Product.Price,
                    Quantity = item.Quantity
                })
                .ToList()
        };

        foreach (var cartItem in cart.Items)
        {
            cartItem.Product.StockQuantity -= cartItem.Quantity;
        }

        _dbContext.Orders.Add(order);
        _dbContext.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, MapOrderResponse(order));
    }

    [HttpPut("{orderId:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderResponse>> UpdateOrderStatus([FromRoute] int orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _dbContext.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order is null)
        {
            return NotFound();
        }

        order.Status = request.Status;
        await _dbContext.SaveChangesAsync();

        return Ok(MapOrderResponse(order));
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
    }

    private static OrderResponse MapOrderResponse(Order order)
    {
        return new OrderResponse
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
        };
    }

    private static string GenerateConfirmationNumber()
    {
        return $"BM-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";
    }
}

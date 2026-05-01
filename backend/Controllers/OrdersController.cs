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
        List<OrderItem> orderItems = new();
        decimal total = 0;

        // Determine if this is guest or authenticated checkout
        if (currentUserId is not null)
        {
            // Authenticated user: fetch cart from database
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

            orderItems = cart.Items
                .Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductTitle = item.Product.Title,
                    UnitPrice = item.Product.Price,
                    Quantity = item.Quantity
                })
                .ToList();

            total = cart.Items.Sum(item => item.Product.Price * item.Quantity);

            // Deduct stock and clear cart
            foreach (var cartItem in cart.Items)
            {
                cartItem.Product.StockQuantity -= cartItem.Quantity;
            }
            _dbContext.CartItems.RemoveRange(cart.Items);
            cart.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            // Guest user: validate items in request
            if (request.Items is null || request.Items.Count == 0)
            {
                return BadRequest(new { message = "Cannot place an order with an empty cart." });
            }

            var productIds = request.Items.Select(x => x.ProductId).ToList();
            var products = await _dbContext.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            if (products.Count != request.Items.Count)
            {
                return BadRequest(new { message = "One or more products not found." });
            }

            foreach (var item in request.Items)
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductId);
                if (product is null || product.StockQuantity < item.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient stock for one or more products." });
                }

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductTitle = product.Title,
                    UnitPrice = product.Price,
                    Quantity = item.Quantity
                });

                total += product.Price * item.Quantity;
                product.StockQuantity -= item.Quantity;
            }
        }

        var order = new Order
        {
            UserId = currentUserId,
            OrderDate = DateTime.UtcNow,
            ConfirmationNumber = GenerateConfirmationNumber(),
            ShippingAddress = request.ShippingAddress.Trim(),
            Status = "Placed",
            Total = total,
            Items = orderItems
        };

        _dbContext.Orders.Add(order);
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

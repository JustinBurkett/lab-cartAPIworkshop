using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Dtos;
using BuckeyeMarketplace.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuckeyeMarketplace.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize(Roles = "User,Admin")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CartController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
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

        if (cart is null)
        {
            return NotFound();
        }

        return Ok(MapCartResponse(cart));
    }

    [HttpPost]
    public async Task<ActionResult<CartItemResponse>> AddToCart([FromBody] AddToCartRequest request)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized(new { message = "Missing user claim in token." });
        }

        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);
        if (product is null)
        {
            return NotFound();
        }

        if (product.StockQuantity < 1)
        {
            return BadRequest("This product is currently out of stock.");
        }

        var cart = await _dbContext.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == currentUserId);

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(item => item.ProductId == request.ProductId);

        CartItem cartItem;
        if (existingItem is not null)
        {
            var nextQuantity = existingItem.Quantity + request.Quantity;
            if (nextQuantity > product.StockQuantity)
            {
                return BadRequest("Requested quantity exceeds available stock.");
            }

            existingItem.Quantity += request.Quantity;
            cartItem = existingItem;
        }
        else
        {
            if (request.Quantity > product.StockQuantity)
            {
                return BadRequest("Requested quantity exceeds available stock.");
            }

            cartItem = new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Product = product
            };

            cart.Items.Add(cartItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        var response = MapCartItemResponse(cartItem, product);
        return CreatedAtAction(nameof(GetCart), response);
    }

    [HttpPut("{cartItemId:int}")]
    public async Task<ActionResult<CartItemResponse>> UpdateCartItem([FromRoute] int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized(new { message = "Missing user claim in token." });
        }

        var cartItem = await _dbContext.CartItems
            .Include(ci => ci.Cart)
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId);

        if (cartItem is null)
        {
            return NotFound();
        }

        if (cartItem.Cart.UserId != currentUserId)
        {
            return Forbid();
        }

        if (cartItem.Product.StockQuantity < request.Quantity)
        {
            return BadRequest("Requested quantity exceeds available stock.");
        }

        cartItem.Quantity = request.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(MapCartItemResponse(cartItem, cartItem.Product));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCartItem([FromRoute] int id)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized(new { message = "Missing user claim in token." });
        }

        var cartItem = await _dbContext.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == id);

        if (cartItem is null)
        {
            return NotFound();
        }

        if (cartItem.Cart.UserId != currentUserId)
        {
            return Forbid();
        }

        _dbContext.CartItems.Remove(cartItem);
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized(new { message = "Missing user claim in token." });
        }

        var cart = await _dbContext.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == currentUserId);

        if (cart is null)
        {
            return NotFound();
        }

        if (cart.Items.Count > 0)
        {
            _dbContext.CartItems.RemoveRange(cart.Items);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    private static CartResponse MapCartResponse(Cart cart)
    {
        return new CartResponse
        {
            Id = cart.Id,
            UserId = cart.UserId,
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt,
            Items = cart.Items
                .Select(item => MapCartItemResponse(item, item.Product))
                .ToList()
        };
    }

    private static CartItemResponse MapCartItemResponse(CartItem item, Product product)
    {
        return new CartItemResponse
        {
            CartItemId = item.Id,
            ProductId = item.ProductId,
            ProductName = product.Title,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Quantity = item.Quantity
        };
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
    }
}

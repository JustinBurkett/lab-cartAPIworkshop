using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Dtos;
using BuckeyeMarketplace.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplace.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private const string CurrentUserId = "default-user";

    private readonly AppDbContext _dbContext;

    public CartController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var cart = await _dbContext.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
        {
            return NotFound();
        }

        return Ok(MapCartResponse(cart));
    }

    [HttpPost]
    public async Task<ActionResult<CartItemResponse>> AddToCart([FromBody] AddToCartRequest request)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);
        if (product is null)
        {
            return NotFound();
        }

        var cart = await _dbContext.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = CurrentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(item => item.ProductId == request.ProductId);

        CartItem cartItem;
        if (existingItem is not null)
        {
            existingItem.Quantity += request.Quantity;
            cartItem = existingItem;
        }
        else
        {
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

    [HttpPut]
    public async Task<ActionResult<CartItemResponse>> UpdateCartItem([FromBody] UpdateCartItemRequest request)
    {
        var cartItem = await _dbContext.CartItems
            .Include(ci => ci.Cart)
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.Id == request.CartItemId);

        if (cartItem is null)
        {
            return NotFound();
        }

        if (cartItem.Cart.UserId != CurrentUserId)
        {
            return Forbid();
        }

        cartItem.Quantity = request.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(MapCartItemResponse(cartItem, cartItem.Product));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCartItem([FromRoute] int id)
    {
        var cartItem = await _dbContext.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == id);

        if (cartItem is null)
        {
            return NotFound();
        }

        if (cartItem.Cart.UserId != CurrentUserId)
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
        var cart = await _dbContext.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

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
}

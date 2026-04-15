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
            .OrderByDescending(order => order.CreatedAtUtc)
            .ToListAsync();

        var responses = orders.Select(order => new OrderResponse
        {
            Id = order.Id,
            UserId = order.UserId,
            CreatedAtUtc = order.CreatedAtUtc,
            TotalAmount = order.TotalAmount,
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

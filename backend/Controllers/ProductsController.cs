using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Models; 

namespace BuckeyeMarketplace.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ProductsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _dbContext.Products.ToListAsync();
        return Ok(products);
    }

    // GET: api/products/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct([FromRoute] int id)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            return NotFound(); // Returns 404 if not found
        }
        return Ok(product);
    }
}
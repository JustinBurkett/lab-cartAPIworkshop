using Microsoft.AspNetCore.Mvc;
using BuckeyeMarketplace.Models; 

namespace BuckeyeMarketplace.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    
    private static readonly List<Product> _products = new List<Product>
    {
        new Product { Id = 1, Title = "Engineering Lab Manual", Description = "Slightly used, vital for ENGR 1181.", Price = 45.00m, Category = "Textbooks", SellerName = "Brutus", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=1" },
        new Product { Id = 2, Title = "Scarlet Quarter-Zip", Description = "Size Large, very comfy.", Price = 35.00m, Category = "Clothing", SellerName = "Cassie", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=2" },
        new Product { Id = 3, Title = "Graphing Calculator", Description = "TI-84 Plus, works great.", Price = 80.00m, Category = "Electronics", SellerName = "Thomas", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=3" },
        new Product { Id = 4, Title = "Oval Picnic Blanket", Description = "Perfect for study sessions on the grass.", Price = 15.00m, Category = "Other", SellerName = "Sarah", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=4" },
        new Product { Id = 5, Title = "Noise Cancelling Headphones", Description = "Great for Thompson Library sessions.", Price = 120.00m, Category = "Electronics", SellerName = "Alex", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=5" },
        new Product { Id = 6, Title = "Chemistry Goggles", Description = "Still in original packaging.", Price = 10.00m, Category = "Textbooks", SellerName = "Mike", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=6" },
        new Product { Id = 7, Title = "Buckeye Beanie", Description = "Keeps you warm during the Michigan game.", Price = 20.00m, Category = "Clothing", SellerName = "Elena", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=7" },
        new Product { Id = 8, Title = "Used Mini-Fridge", Description = "Fits perfectly in Morrill Tower dorms.", Price = 50.00m, Category = "Electronics", SellerName = "David", PostedDate = DateTime.Now, ImageUrl = "https://picsum.photos/200?random=8" }
    };

    // GET: api/products
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetProducts()
    {
        return Ok(_products);
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct([FromRoute] int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null)
        {
            return NotFound(); // Returns 404 if not found
        }
        return Ok(product);
    }
}
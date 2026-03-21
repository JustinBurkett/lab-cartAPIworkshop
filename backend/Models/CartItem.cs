using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BuckeyeMarketplace.Models;

public class CartItem
{
    public int Id { get; set; }

    public int CartId { get; set; }

    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [ForeignKey(nameof(CartId))]
    public Cart Cart { get; set; } = null!;

    [ForeignKey(nameof(ProductId))]
    public Product Product { get; set; } = null!;
}

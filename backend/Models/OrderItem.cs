using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    [Required]
    public string ProductTitle { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public Order Order { get; set; } = null!;
}

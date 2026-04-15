using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public decimal TotalAmount { get; set; }

    [Required]
    public string Status { get; set; } = "Placed";

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

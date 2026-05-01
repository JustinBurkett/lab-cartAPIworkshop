using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Models;

public class Order
{
    public int Id { get; set; }

    public string? UserId { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [Required]
    public string ConfirmationNumber { get; set; } = string.Empty;

    [Required]
    public string ShippingAddress { get; set; } = string.Empty;

    public decimal Total { get; set; }

    [Required]
    public string Status { get; set; } = "Placed";

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

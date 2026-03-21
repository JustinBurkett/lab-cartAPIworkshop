namespace BuckeyeMarketplace.Dtos;

public class CartResponse
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public List<CartItemResponse> Items { get; set; } = new();

    public int TotalItems => Items.Sum(item => item.Quantity);

    public decimal Subtotal => Items.Sum(item => item.LineTotal);

    public decimal Total => Subtotal;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}

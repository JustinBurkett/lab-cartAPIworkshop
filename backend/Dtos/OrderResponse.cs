namespace BuckeyeMarketplace.Dtos;

public class OrderResponse
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public List<OrderItemResponse> Items { get; set; } = new();
}

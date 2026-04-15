namespace BuckeyeMarketplace.Dtos;

public class OrderResponse
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; }

    public string ConfirmationNumber { get; set; } = string.Empty;

    public string ShippingAddress { get; set; } = string.Empty;

    public decimal Total { get; set; }

    public string Status { get; set; } = string.Empty;

    public List<OrderItemResponse> Items { get; set; } = new();
}

namespace BuckeyeMarketplace.Dtos;

public class OrderItemResponse
{
    public int ProductId { get; set; }

    public string ProductTitle { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }
}

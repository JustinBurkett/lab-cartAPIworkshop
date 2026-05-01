namespace BuckeyeMarketplace.Dtos;

public class PlaceOrderRequest
{
    public string ShippingAddress { get; set; } = string.Empty;
    public List<GuestCartItemRequest> Items { get; set; } = new();
}

public class GuestCartItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

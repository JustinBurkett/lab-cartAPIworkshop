namespace BuckeyeMarketplace.Dtos;

public class UpsertProductRequest
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string Category { get; set; } = string.Empty;

    public string SellerName { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
}

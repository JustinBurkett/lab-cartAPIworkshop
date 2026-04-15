using BuckeyeMarketplace.Dtos;
using BuckeyeMarketplace.Validators;
using Xunit;

namespace BuckeyeMarketplace.Tests;

public class OrderValidatorUnitTests
{
    [Fact]
    public void PlaceOrderRequestValidator_Should_Fail_When_ShippingAddress_TooShort()
    {
        var validator = new PlaceOrderRequestValidator();
        var request = new PlaceOrderRequest
        {
            ShippingAddress = "123 Main"
        };

        var result = validator.Validate(request);

        Assert.False(result.IsValid);
    }

    [Fact]
    public void UpdateOrderStatusRequestValidator_Should_Pass_For_AllowedStatus()
    {
        var validator = new UpdateOrderStatusRequestValidator();
        var request = new UpdateOrderStatusRequest
        {
            Status = "Shipped"
        };

        var result = validator.Validate(request);

        Assert.True(result.IsValid);
    }

    [Fact]
    public void UpdateOrderStatusRequestValidator_Should_Fail_For_UnknownStatus()
    {
        var validator = new UpdateOrderStatusRequestValidator();
        var request = new UpdateOrderStatusRequest
        {
            Status = "LostInTransit"
        };

        var result = validator.Validate(request);

        Assert.False(result.IsValid);
    }
}

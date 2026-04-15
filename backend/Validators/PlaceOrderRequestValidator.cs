using BuckeyeMarketplace.Dtos;
using FluentValidation;

namespace BuckeyeMarketplace.Validators;

public class PlaceOrderRequestValidator : AbstractValidator<PlaceOrderRequest>
{
    public PlaceOrderRequestValidator()
    {
        RuleFor(x => x.ShippingAddress)
            .NotEmpty()
            .MinimumLength(10)
            .MaximumLength(200)
            .WithMessage("Shipping address must be between 10 and 200 characters.");
    }
}

using BuckeyeMarketplace.Dtos;
using FluentValidation;

namespace BuckeyeMarketplace.Validators;

public class UpdateCartItemRequestValidator : AbstractValidator<UpdateCartItemRequest>
{
    public UpdateCartItemRequestValidator()
    {
        RuleFor(x => x.CartItemId)
            .GreaterThan(0)
            .WithMessage("cartItemId is required.");

        RuleFor(x => x.Quantity)
            .InclusiveBetween(1, 99)
            .WithMessage("Quantity must be between 1 and 99.");
    }
}

using BuckeyeMarketplace.Dtos;
using FluentValidation;

namespace BuckeyeMarketplace.Validators;

public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequest>
{
    private static readonly string[] AllowedStatuses =
    [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    public UpdateOrderStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(status => AllowedStatuses.Contains(status))
            .WithMessage("Status must be one of: Placed, Processing, Shipped, Delivered, Cancelled.");
    }
}

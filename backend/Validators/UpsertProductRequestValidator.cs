using BuckeyeMarketplace.Dtos;
using FluentValidation;

namespace BuckeyeMarketplace.Validators;

public class UpsertProductRequestValidator : AbstractValidator<UpsertProductRequest>
{
    public UpsertProductRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.Description)
            .NotEmpty()
            .MaximumLength(1000);

        RuleFor(x => x.Price)
            .GreaterThan(0);

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Category)
            .NotEmpty()
            .MaximumLength(60);

        RuleFor(x => x.SellerName)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.ImageUrl)
            .NotEmpty()
            .MaximumLength(500)
            .Must(value => Uri.TryCreate(value, UriKind.Absolute, out _))
            .WithMessage("ImageUrl must be a valid absolute URL.");
    }
}

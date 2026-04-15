using BuckeyeMarketplace.Dtos;
using FluentValidation;

namespace BuckeyeMarketplace.Validators;

public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
{
    public RefreshTokenRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty();
    }
}

using BuckeyeMarketplace.Models;

namespace BuckeyeMarketplace.Services;

public interface ITokenService
{
    (string Token, DateTime ExpiresAtUtc) GenerateAccessToken(ApplicationUser user, IList<string> roles);
    string GenerateRefreshToken();
    string HashRefreshToken(string refreshToken);
}

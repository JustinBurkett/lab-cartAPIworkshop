namespace BuckeyeMarketplace.Dtos;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;

    public DateTime AccessTokenExpiresAtUtc { get; set; }

    public string RefreshToken { get; set; } = string.Empty;

    public DateTime RefreshTokenExpiresAtUtc { get; set; }

    public string Email { get; set; } = string.Empty;

    public IList<string> Roles { get; set; } = new List<string>();
}

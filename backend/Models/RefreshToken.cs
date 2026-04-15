using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Models;

public class RefreshToken
{
    public int Id { get; set; }

    [Required]
    public string TokenHash { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? RevokedAtUtc { get; set; }

    public string? ReplacedByTokenHash { get; set; }

    public ApplicationUser User { get; set; } = null!;
}

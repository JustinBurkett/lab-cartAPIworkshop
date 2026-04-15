using BuckeyeMarketplace.Data;
using BuckeyeMarketplace.Dtos;
using BuckeyeMarketplace.Models;
using BuckeyeMarketplace.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplace.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string UserRoleName = "User";
    private static readonly TimeSpan RefreshTokenTtl = TimeSpan.FromDays(7);

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly AppDbContext _dbContext;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _dbContext = dbContext;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(new
            {
                message = "Registration failed.",
                errors = createResult.Errors.Select(error => error.Description)
            });
        }

        var addRoleResult = await _userManager.AddToRoleAsync(user, UserRoleName);
        if (!addRoleResult.Succeeded)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = "Registration failed while assigning user role.",
                errors = addRoleResult.Errors.Select(error => error.Description)
            });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var authResponse = await BuildAuthResponseAsync(user, roles);
        return Created("/api/auth/register", authResponse);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var passwordCheck = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!passwordCheck.Succeeded)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var authResponse = await BuildAuthResponseAsync(user, roles);

        return Ok(authResponse);
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshTokenRequest request)
    {
        var refreshTokenHash = _tokenService.HashRefreshToken(request.RefreshToken);
        var refreshTokenRecord = await _dbContext.RefreshTokens
            .Include(token => token.User)
            .FirstOrDefaultAsync(token => token.TokenHash == refreshTokenHash);

        if (refreshTokenRecord is null || refreshTokenRecord.RevokedAtUtc is not null || refreshTokenRecord.ExpiresAtUtc <= DateTime.UtcNow)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }

        var roles = await _userManager.GetRolesAsync(refreshTokenRecord.User);

        refreshTokenRecord.RevokedAtUtc = DateTime.UtcNow;
        var newRawRefreshToken = _tokenService.GenerateRefreshToken();
        var newRefreshTokenHash = _tokenService.HashRefreshToken(newRawRefreshToken);
        refreshTokenRecord.ReplacedByTokenHash = newRefreshTokenHash;

        var newRefreshToken = new RefreshToken
        {
            TokenHash = newRefreshTokenHash,
            UserId = refreshTokenRecord.UserId,
            ExpiresAtUtc = DateTime.UtcNow.Add(RefreshTokenTtl)
        };

        _dbContext.RefreshTokens.Add(newRefreshToken);
        await _dbContext.SaveChangesAsync();

        var (accessToken, accessTokenExpiresAtUtc) = _tokenService.GenerateAccessToken(refreshTokenRecord.User, roles);

        return Ok(new AuthResponse
        {
            AccessToken = accessToken,
            AccessTokenExpiresAtUtc = accessTokenExpiresAtUtc,
            RefreshToken = newRawRefreshToken,
            RefreshTokenExpiresAtUtc = newRefreshToken.ExpiresAtUtc,
            Email = refreshTokenRecord.User.Email ?? string.Empty,
            Roles = roles
        });
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(ApplicationUser user, IList<string> roles)
    {
        var (accessToken, accessTokenExpiresAtUtc) = _tokenService.GenerateAccessToken(user, roles);
        var rawRefreshToken = _tokenService.GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            TokenHash = _tokenService.HashRefreshToken(rawRefreshToken),
            UserId = user.Id,
            ExpiresAtUtc = DateTime.UtcNow.Add(RefreshTokenTtl)
        };

        _dbContext.RefreshTokens.Add(refreshToken);
        await _dbContext.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            AccessTokenExpiresAtUtc = accessTokenExpiresAtUtc,
            RefreshToken = rawRefreshToken,
            RefreshTokenExpiresAtUtc = refreshToken.ExpiresAtUtc,
            Email = user.Email ?? string.Empty,
            Roles = roles
        };
    }
}

using System.Net;
using Xunit;

namespace BuckeyeMarketplace.Tests;

public class AuthenticatedOrdersIntegrationTests : IClassFixture<AuthApiWebApplicationFactory>
{
    private readonly AuthApiWebApplicationFactory _factory;

    public AuthenticatedOrdersIntegrationTests(AuthApiWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetMyOrders_Should_ReturnOk_For_AuthenticatedUser()
    {
        using var client = _factory.CreateClient();

        var ordersResponse = await client.GetAsync("/api/orders/mine");

        Assert.Equal(HttpStatusCode.OK, ordersResponse.StatusCode);
    }
}

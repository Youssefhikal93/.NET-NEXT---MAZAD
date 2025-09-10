using System;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Integrationtest.Fixtuers;
using AuctionService.Integrationtest.Utils;
using Contracts;
using MassTransit.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.Integrationtest;

[Collection("Shared collection")]
public class AuctionBusTests : IAsyncLifetime
{

    private readonly CustomeWebAppFactory _factory;
    private readonly HttpClient _httpClient;
    private ITestHarness _testHarness;
    public AuctionBusTests(CustomeWebAppFactory factory)
    {
        _factory = factory;
        _httpClient = factory.CreateClient();
        _testHarness = factory.Services.GetTestHarness();
    }

    [Fact]
    public async Task GrateAuction_withvalidObj_shouldPublishAuctionCreated()
    {
        // Given
        var auction = GetAuctionForCreate();
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));
        // When
        var response = await _httpClient.PostAsJsonAsync("api/auctions", auction);
        // Then
        response.EnsureSuccessStatusCode();
        Assert.True(await _testHarness.Published.Any<AuctionCreated>());
    }

    public Task InitializeAsync() => Task.CompletedTask;
    public Task DisposeAsync()
    {
        var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        DbHelper.ReInitDbForTests(db);
        return Task.CompletedTask;

    }


    private CreateAuctionDto GetAuctionForCreate()
    {
        return new CreateAuctionDto
        {
            Make = "test",
            Model = "test",
            Color = "test",
            ImageUrl = "test",
            Mileage = 1,
            Year = 1,
            ReservePrice = 1
        };
    }
}

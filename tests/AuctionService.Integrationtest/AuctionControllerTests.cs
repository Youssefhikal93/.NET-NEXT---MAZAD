using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Integrationtest.Fixtuers;
using AuctionService.Integrationtest.Utils;
using AuctionService.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.Integrationtest;
[Collection("Shared collection")]
public class AuctionControllerTests :  IAsyncLifetime
{
    private readonly CustomeWebAppFactory _factory;
    private readonly HttpClient _httpClient;
    private const string GT_ID = "afbee524-5972-4075-8800-7d1f9d7b0a0c";

    public AuctionControllerTests(CustomeWebAppFactory factory)
    {
        _factory = factory;
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task GetAuctions_ShouldReurn3Auctions()
    {
        // arrange ?
        // When
        var response = await _httpClient.GetFromJsonAsync<List<AuctionDto>>("api/auctions");

        // Then
        Assert.Equal(3, response.Count);
    }

    [Fact]
    public async Task GetAuctionsById_WithValidGuid_ShouldReturnAuction()
    {
        // arrange
        // When
        var response = await _httpClient.GetFromJsonAsync<AuctionDto>($"api/auctions/{GT_ID}");

        // Then
        Assert.Equal("GT", response.Model);
    }
    [Fact]
    public async Task GetAuctionsById_WithInValidGuid_ShouldReturnbadRequest400()
    {
        // arrange
        // When
        var response = await _httpClient.GetAsync($"api/auctions/notvalidId");

        // Then
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
    [Fact]
    public async Task GetAuctionsById_WithInValidGuid_ShouldReturnNotfound404()
    {
        // arrange
        // When
        var response = await _httpClient.GetAsync($"api/auctions/{Guid.NewGuid()}");

        // Then
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateAuction_WithNoAuth_ShouldReturn401()
    {
        // arrange
        var auction = new CreateAuctionDto { Make = "test" };
        // When
        var response = await _httpClient.PostAsJsonAsync($"api/auctions/", auction);

        // Then
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateAuction_WithAuth_ShouldReturn201()
    {
        // arrange
        var auction = GetAuctionForCreate();
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));
        // When
        var response = await _httpClient.PostAsJsonAsync($"api/auctions/", auction);
        var createdAution = await response.Content.ReadFromJsonAsync<AuctionDto>();
        // Then
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal("bob", createdAution.Seller);
        
    }

    [Fact]
    public async Task CreateAuction_WithInvalidCreateAuctionDto_ShouldReturn400()
    {
        // arrange
        var auction = new Auction
        {
        };
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));
        // act
        var response = await _httpClient.PostAsJsonAsync($"api/auctions/", auction);
        // assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndUser_ShouldReturn200()
    {
        // arrange
        var updatedAuction = new UpdateAuctionDto {Make="test-updated"};
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));
        // act
        var response = await _httpClient.PutAsJsonAsync($"api/auctions/{GT_ID}",updatedAuction);
        // assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndInvalidUser_ShouldReturn401()
    {
        // arrange
        var updatedAuction = new UpdateAuctionDto {Make="test-updated"};
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("hikoo"));
        // act
        var response = await _httpClient.PutAsJsonAsync($"api/auctions/{GT_ID}",updatedAuction);
        // assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
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
            ReservePrice=1
        };
    }

}

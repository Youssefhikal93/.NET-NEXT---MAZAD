using System;
using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services;

public class CheckAuctionFinished : BackgroundService
{
    private readonly ILogger<CheckAuctionFinished> _logger;
    private readonly IServiceProvider _services;

    public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider services)
    {
        _logger = logger;
        _services = services;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Checking for finished auction!");
        stoppingToken.Register(() => _logger.LogInformation("==> Auction check is topping"));

        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctions(stoppingToken);
            await Task.Delay(5000, stoppingToken);
        }
    }

    private async Task CheckAuctions(CancellationToken stoppingToken)
    {
        var FinishedAuctions = await DB.Find<Auction>()
            .Match(x => x.AuctionEnd <= DateTime.UtcNow)
            .Match(x => !x.Finished)
            .ExecuteAsync(stoppingToken);

        if (FinishedAuctions.Count == 0) return;

        _logger.LogInformation($"=>{FinishedAuctions.Count} has been found!");

        using var scope = _services.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        foreach (var item in FinishedAuctions)
        {
            item.Finished = true;
            await item.SaveAsync(null, stoppingToken);

            var winnigBid = await DB.Find<Bid>()
                .Match(x => x.AuctionId == item.ID)
                .Match(a => a.BidStatus == BidStatus.Accepted)
                .Sort(x => x.Descending(x => x.Amount))
                .ExecuteFirstAsync(stoppingToken);

            await endpoint.Publish(new AuctionFinished
            {
                ItemSold = winnigBid != null,
                AuctionId = item.ID,
                Winner = winnigBid?.Bidder,
                Amount = winnigBid?.Amount,
                Seller = item.Seller
                
            },stoppingToken);
        }
    }
}

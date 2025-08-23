using System;
using Contracts;
using MassTransit;
using AuctionService.Data;
using AuctionService.Models;
namespace AuctionService.Consumers;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly ApplicationDbContext _dbcontext;

    public BidPlacedConsumer(ApplicationDbContext dbcontext)
    {
        _dbcontext = dbcontext;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        System.Console.WriteLine("===> consuming bid placed");
        var auction = await _dbcontext.Auctions.
        FindAsync(context.Message.Id);

        if (auction.CurrentHighBid == null || context.Message.BidStatus.Contains("Accepted") && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await _dbcontext.SaveChangesAsync();
        }
    }
}

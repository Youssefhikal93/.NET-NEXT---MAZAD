using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly ApplicationDbContext _dbContext;

    public BidPlacedConsumer(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Consuming bid placed");

        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionId));

        if (auction.CurrentHighBid == null 
            || context.Message.BidStatus.Contains("Accepted") 
            && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await _dbContext.SaveChangesAsync();
        }
    }
}

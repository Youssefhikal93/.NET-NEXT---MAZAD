using System;
using AuctionService;
using BiddingService.Models;
using Grpc.Net.Client;

namespace BiddingService.Services;

public class GrpcAuctionClient
{
    private readonly ILogger<GrpcAuctionClient> _logger;
    private readonly IConfiguration _config;

    public GrpcAuctionClient(ILogger<GrpcAuctionClient> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }

    public Auction GetAuction(string id)
    {
        _logger.LogInformation("Calling Grpc service");
        var channel = GrpcChannel.ForAddress(_config["GrpcAuction"]);
        var clinet = new GrpcAuction.GrpcAuctionClient(channel);
        var request = new GetAuctionRequest { Id = id };

        try
        {
            var reply = clinet.GetAuction(request);
            var auction = new Auction
            {
                ID = reply.Auction.Id,
                AuctionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                ReservePrice = reply.Auction.ReservePrice,
                Seller = reply.Auction.Seller

            };
            return auction; 
        }
        catch (System.Exception ex)
        {
            _logger.LogError(ex, "Coudlnt not call grpc Server"); 
            return null;
        }
    }

}

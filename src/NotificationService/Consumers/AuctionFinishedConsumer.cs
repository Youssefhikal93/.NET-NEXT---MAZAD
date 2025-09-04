using System;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionFinishedConsumer : IConsumer<AuctionFinishedConsumer>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public AuctionFinishedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    public async Task Consume(ConsumeContext<AuctionFinishedConsumer> context)
    {
        System.Console.WriteLine("Auction finished notifiction");
        await _hubContext.Clients.All.SendAsync("AuctionFinished", context.Message);
    }
}

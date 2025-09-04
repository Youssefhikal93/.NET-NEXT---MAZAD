using System;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class BidPlacedConsumer : IConsumer<BidPlacedConsumer>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public BidPlacedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    public async Task Consume(ConsumeContext<BidPlacedConsumer> context)
    {
         System.Console.WriteLine("bidPlaced notifiction");
        await _hubContext.Clients.All.SendAsync("bidPlaced", context.Message);
    }
}

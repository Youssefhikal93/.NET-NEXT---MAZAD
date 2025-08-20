using System;
using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    
     private readonly IMapper _mapper;

    public AuctionUpdatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        System.Console.WriteLine("Consuming the auction updated ==>" + context.Message.Id);

        var item = _mapper.Map<Item>(context.Message);
        var result = await DB.Update<Item>()
       .Match(el => el.ID == context.Message.Id)
       .ModifyOnly(x => new
       {
           x.Color,
           x.Make,
           x.Mileage,
           x.Year,
           x.Model
       }, item).ExecuteAsync();

               if (!result.IsAcknowledged)
            throw new MessageException(typeof(AuctionUpdated), "Problem updating the auction!");

    }
}

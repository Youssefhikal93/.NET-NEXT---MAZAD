using System;
using AutoMapper;
using BiddingService.Dtos;
using BiddingService.Models;

namespace BiddingService.RequestHelpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Bid, BidDto>();
    }
    
}

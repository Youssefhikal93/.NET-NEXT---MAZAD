using System;
using AuctionService.DTOs;
using AuctionService.Models;
using Microsoft.AspNetCore.Mvc;

namespace AuctionService.Data;

public interface IAuctionRepository
{
    Task<List<AuctionDto>> GetAllAuctionsAsync(string date);
    Task<AuctionDto> GetAuctionByIdAsync(Guid id);
    Task<Auction> GetAuctionByIdEntity(Guid id);
    void AddAuction(Auction auction);
    void RemoveAuction(Auction auction);

    Task<bool> SaveChangesAsync(); 

}

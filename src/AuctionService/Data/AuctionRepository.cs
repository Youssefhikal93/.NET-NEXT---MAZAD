using System;
using AuctionService.DTOs;
using AuctionService.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionRepository : IAuctionRepository
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AuctionRepository(ApplicationDbContext context, IMapper mapper )
    {
        _context = context;
        _mapper = mapper;
    }
    public void AddAuction(Auction auction)
    {
        _context.Auctions.Add(auction);
    }

    public async Task<List<AuctionDto>> GetAllAuctionsAsync(string date)
    {
        var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

            if (!string.IsNullOrEmpty(date))
            {
                query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
            }


            return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
            
    }

    public async Task<AuctionDto> GetAuctionByIdAsync(Guid id)
    {
        var auction = await _context.Auctions
           .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
           .FirstOrDefaultAsync(x => x.Id == id);

        return auction;
    }

    public async Task<Auction> GetAuctionByIdEntity(Guid id)
    {
        var auction = await _context.Auctions.Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        return auction;
    }

    public void RemoveAuction(Auction auction)
    {
        _context.Auctions.Remove(auction);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}

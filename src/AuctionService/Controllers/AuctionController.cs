using System.Drawing;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers
{
    [Route("api/auctions")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;

        public AuctionController(ApplicationDbContext context, IMapper mapper,IPublishEndpoint publishEndpoint)
        {
            _context = context;
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
        }

        [HttpGet]
        public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string date)
        {

            var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

            if (!string.IsNullOrEmpty(date))
            {
                query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
            }


            return Ok(await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync());
            
            // we should create class AuctionsResponse to store the shape of the data and then search db http client should getJsonAsync<Auctionsreposne>
            // return Ok(new
            // {
            //     results = query.Count(),
            //     data = await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync()

            // });

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
        {
            var auction = await _context.Auctions.FirstOrDefaultAsync(x => x.Id == id);
            if (auction == null) return NotFound();

            return _mapper.Map<AuctionDto>(auction);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto)
        {
            var auction = _mapper.Map<Auction>(auctionDto);

            //ToDO add current seller 
            auction.Seller = User.Identity.Name;
            _context.Add(auction);

            // publish to rabbitMq as createdAuction
            var newAuction = _mapper.Map<AuctionDto>(auction);
            await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

            var result = await _context.SaveChangesAsync() > 0;



            if (!result) return BadRequest("Couldn't sava the auction to the DB!");

            return CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, newAuction);
        }

        [HttpPut("{id}")]
         [Authorize]
        public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
        {
            var auction = await _context.Auctions.Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (auction == null) return NotFound();

            //TODO: match the user with lggedin user
            if (auction.Seller != User.Identity.Name) return Unauthorized("Not authorized to perform the action dude ❌");

            auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
            auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
            auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;

            await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));


            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return BadRequest("Couldn't update the auction to the DB!");

            //Return only a msg
            return Ok(new { message = "Auction updated successfully" });
            //To return full auction obkect
            // return Ok(_mapper.Map<AuctionDto>(auction));

        }

        [HttpDelete("{id}")]
         [Authorize]
        public async Task<ActionResult> DeleteAuction(Guid id)
        {
            var auction = await _context.Auctions.FirstOrDefaultAsync(x => x.Id == id);

            if (auction == null) return NotFound("Not able to find auction to delete!");
            //TODO: seller == user
            if (auction.Seller != User.Identity.Name) return Forbid("Not authorized to perform the action dude ❌");

            _context.Remove(auction);

            await _publishEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });

            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return BadRequest("Error happened 😁");

            return NoContent();
        }
    }
}

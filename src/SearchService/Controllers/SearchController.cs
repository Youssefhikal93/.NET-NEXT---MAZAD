using Microsoft.AspNetCore.Http;
using MongoDB.Entities;
using SearchService.Models;
using Microsoft.AspNetCore.Mvc;
using SearchService.RequestHelpers;

namespace SearchService.Controllers
{
    [Route("api/search")]
    [ApiController]
    public class SearchController : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<List<Item>>> SearchItmes([FromQuery]SearchParams searchParams)
        {
            var query = DB.PagedSearch<Item,Item>();
            
            // searching
            if (!string.IsNullOrEmpty(searchParams.SearchTerm))
            {
                query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
            }

            if (!string.IsNullOrEmpty(searchParams.Seller))
            {
                query.Match(x => x.Seller == searchParams.Seller);
            }
             if (!string.IsNullOrEmpty(searchParams.Winner))
            {
                query.Match(x => x.Winner == searchParams.Winner);
            }

            //orderByfilters
            query = searchParams.OrderBy switch
            {
                "make" => query.Sort(x => x.Ascending(a => a.Make))
                    .Sort(x=>x.Ascending(a=>a.Model)),
                "new" => query.Sort(x => x.Descending(a => a.CreateDate)),
                _ => query.Sort(x=>x.Ascending(a=>a.AuctionEnd))
            };

            //FilterBY
            query = searchParams.FilterBy switch
            {
                "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
                "endingSoon" => query.Match(x => x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),
                "live" => query.Match(x => x.AuctionEnd > DateTime.UtcNow),
                _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
            };

            // Special case: when filtering by winner, show finished auctions (won auctions)
            if (!string.IsNullOrEmpty(searchParams.Winner))
            {
                query = query.Match(x => x.AuctionEnd < DateTime.UtcNow);
            }


            //pagination
            query.PageNumber(searchParams.PageNumber);
            query.PageSize(searchParams.PageSize);


            var result = await query.ExecuteAsync();

            return Ok(new
            {

                pageCount = result.PageCount,
                totalCount = result.TotalCount,
                results = result.Results
            });
        }

    }

    
}

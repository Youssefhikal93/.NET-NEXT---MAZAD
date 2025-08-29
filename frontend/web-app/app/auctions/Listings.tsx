import { IAuction, pagedResult } from "@/types";
import AuctionCard from "./AuctionCard";

async function getAuctions():Promise<pagedResult<IAuction>>{
    const res = await fetch("http://localhost:6001/search?pageSize=10")
    
    if(!res.ok) throw new Error("Failed to fetch data!")
        return res.json();
    }


export default async function Listings() {
    const auctions = await getAuctions();
    console.log(auctions)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      { auctions &&
        auctions.results.map((auction:IAuction)=> 
           ( <AuctionCard auction={auction} key={auction.id}/>)
         )
      }
     
    </div>
  )
}

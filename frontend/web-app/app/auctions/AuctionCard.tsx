import Link from "next/link"
import CountDownTimer from "./CountDownTimer"
import CardImage from "./CardImage"
import { IAuction } from "@/app/types/types"

type Props= {
    auction:IAuction
}
export default function AuctionCard({auction}:Props) {
  return (
    <Link  href={`/auctions/details/${auction.id}`} >
        <div className="w-full bg-gray-200 aspect-video rounded-lg overflow-hidden relative">
          <CardImage auction={auction}/>
             <div className=" absolute bottom-0 left-2">
      <CountDownTimer auctionEnd={auction.auctionEnd}/>
      </div>
        </div>
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-gray-700">{auction.make} {auction.model}</h3>
        <p className="font-semibold text-sm">{auction.year}</p>
      </div>
     
    </Link>
  )
}

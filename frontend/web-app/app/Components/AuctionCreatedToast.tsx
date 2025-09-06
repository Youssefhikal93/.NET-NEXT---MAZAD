import Link from "next/link"
import { IAuction } from "../types/types"
import Image from "next/image"

type Props = {
    auction : IAuction
}
export default function AuctionCreatedToast({auction}:Props) {
  return (
    <Link href={`auctions/details/${auction.id}`} className="flex flex-col items-center">
      <div className="felx flex-row items-center gap-2">
        <Image 
        src={auction.imageUrl} 
        alt={auction.make} 
        height={80}
        width={80}
        className="rounded-lg w-auto h-auto"
        />
        <span>New Auction {auction.make} {auction.model}</span>
      </div>
    </Link>
  )
}

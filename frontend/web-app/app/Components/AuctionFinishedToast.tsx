import Link from "next/link"
import { AuctionFinsihed, IAuction } from "../types/types"
import Image from "next/image"

type Props = {
    finishedAuction : AuctionFinsihed
    auction : IAuction
}
export default function AuctionFinishedToast({finishedAuction,auction}:Props) {
  return (
     <Link href={`/auctions/details/${auction.id}`} className='flex flex-col items-center'>
            <div className='flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-gray-200 to-gray-400 rounded-xl shadow-md border border-gray-200'>
    <div className="relative">
        <Image
            src={auction.imageUrl}
            alt={`${auction.make} ${auction.model}`}
            height={90}
            width={90}
            className='rounded-lg object-cover w-20 h-20 border-2 border-white shadow-sm'
        />
        
    </div>
    <div className="flex flex-col">
        <span className="text-sm font-semibold text-red-800">AUCTION FINISHED</span>
        <span className="text-md md:text-lg font-bold text-gray-950">
            {auction.make} {auction.model}
        </span>
        <span className="text-sm text-gray-700">Has just ended!</span>
        {finishedAuction.itemSold && finishedAuction.amount ?   
        <span className="text-sm font-extrabold text-gray-800">Congrats to {finishedAuction.winner} 🏆 for {finishedAuction.amount} Sek</span>
        :
        <span className="text-sm font-extrabold text-gray-800">The item was not sold </span>

    }
    </div>
    <div className="ml-auto">
        <svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </div>
</div>
    </Link>
  )
}

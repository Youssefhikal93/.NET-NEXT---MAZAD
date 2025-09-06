import Link from "next/link"
import { IAuction } from "../types/types"
import Image from "next/image"

type Props = {
    auction : IAuction
}
export default function AuctionCreatedToast({auction}:Props) {
  return (
     <Link href={`/auctions/details/${auction.id}`} className='flex flex-col items-center'>
            <div className='flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl shadow-md border border-gray-200'>
    <div className="relative">
        <Image
            src={auction.imageUrl}
            alt={`${auction.make} ${auction.model}`}
            height={90}
            width={90}
            className='rounded-lg object-cover w-20 h-20 border-2 border-white shadow-sm'
        />
        <div className="absolute -top-2 -right-2">
            <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-900"></span>
            </span>
        </div>
    </div>
    <div className="flex flex-col">
        <span className="text-sm font-semibold text-red-800">NEW AUCTION</span>
        <span className="text-md md:text-lg font-bold text-gray-900">
            {auction.make} {auction.model}
        </span>
        <span className="text-sm text-gray-600">Has just been added!</span>
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

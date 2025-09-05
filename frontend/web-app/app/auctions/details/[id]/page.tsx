import { getAuctionById, getBidsForAuction } from "@/app/_lib/actions/auctions"
import CountDownTimer from "../../CountDownTimer"
import CardImage from "../../CardImage"
import DetailedSpecs from "./DetailedSpecs"
import EditButton from "./EditButton"
import { getCurrentUser } from "@/app/_lib/actions/authActions"
import DeleteButton from "./DeleteButton"
import BidList from "./BidList"

export default async function Details({params}:{params:Promise<{id:string}>}) {
    const {id} = await params
    const data = await getAuctionById(id)
    const user = await getCurrentUser();
    
  return (
    <>
    <div className="flex justify-between items-center font-sans font-extrabold">
       <div className="text-center font-sans text-2xl font-extrabold">
       {data.make} {data.model}
        </div>
        
      
        <div className="flex flex-row gap-3 mb-3">
          <span className="text-xl font font-semibold">Time remaning: </span>
          <h3 className="text-lg font-semibold">
            <CountDownTimer auctionEnd={data.auctionEnd} />
          </h3>
        </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-5 border-b border-gray-400 pb-5">
      <div className="relative w-full bg-gray-2 aspect-square rounded-lg overflow-hidden">
      <CardImage auction={data}/>
      </div>
      
      <div className="">
        <div className="text-center font-sans mb-2 text-lg font-extrabold">
        Bids placed
        </div>
      {/* <div className="border-0 rounded-2xl p-2 bg-gray-200 overflow-y-auto md:max-h-[60vh]">
        {bids.map(bid=>( 
          <BidItem key={bid.id} bid={bid}></BidItem>
        ))}
        </div> */}
        <BidList user={user} auction={data} />
      </div>

    </div>
    <div className="mt-3 grid grid-cols-1 rounded-lg">
        <DetailedSpecs auction={data}/>
    </div>
    <div className="flex items-center justify-center gap-3 my-10">
        {user?.username === data.seller && 
        <>
    <EditButton id={id}/> 
    <DeleteButton id={id}/>
        </>
  }
      </div>
    </>
  )
}

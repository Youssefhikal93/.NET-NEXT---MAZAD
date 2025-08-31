import { getAuctionById } from "@/app/_lib/actions/auctions"
import Heading from "@/app/Components/Heading"
import CountDownTimer from "../../CountDownTimer"
import CardImage from "../../CardImage"
import DetailedSpecs from "./DetailedSpecs"
import EditButton from "./EditButton"
import { getCurrentUser } from "@/app/_lib/actions/authActions"
import DeleteButton from "./DeleteButton"

export default async function Details({params}:{params:Promise<{id:string}>}) {
    const {id} = await params
    const data = await getAuctionById(id)
    const user = await getCurrentUser();
  return (
    <>
    <div className="flex justify-between items-center">
        <Heading title={`${data.make} ${data.model}`} subtitle={``} />
      
        <div className="flex gap-3">
          <h3 className="text-lg font-semibold">
            Time remaning: <CountDownTimer auctionEnd={data.auctionEnd} />
          </h3>
        </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="relative w-full bg-gray-2 aspect-square rounded-lg overflow-hidden">
      <CardImage auction={data}/>
      </div>
      <div className="border-2 rounded-2xl p-2 bg-gray-200">
        <Heading title="Bids" subtitle=""/>
      </div>

    </div>
    <div className="mt-3 grid grid-cols-1 rounded-lg mb-6">
        <DetailedSpecs auction={data}/>
    </div>
    <div className="flex items-center justify-center gap-3 mb-10">
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

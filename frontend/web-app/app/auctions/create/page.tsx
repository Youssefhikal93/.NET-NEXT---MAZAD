import Heading from "@/app/Components/Heading";
import AuctionForm from "../AuctionForm";

export default function Create() {
  return (
    <div className="mx-auto max-w-[75%] shadow-lg bg-white rounded-lg py-4 px-3">
     <Heading title="Sell you car" subtitle="Enter your car details"/>
     <AuctionForm/>
    </div>
  )
}

import { numberWithCommas } from "@/app/_lib/numberWithComma";
import { Bid } from "@/app/types/types"
import { format } from "date-fns";

type Props = {
bid : Bid
}

export default function BidItem({bid}:Props) {

    function getBidInfo(){
        let bgColor = "";
        let text = ""; 
        switch (bid.bidStatus) {
            case "Accepted":
            bgColor="bg-green-200"; 
            text ="Bid accepted";
            break;
            case "AcceptedBelowReserve":
            bgColor="bg-amber-500"; 
            text ="Reserve not met";
            break;
            case "TooLow":
            bgColor="bg-red-200"; 
            text ="Bid is too low";
            break;
            default :
            bgColor="bg-red-200"; 
            text ="Bid placed after the acution finished!";
            break;
               
        }
        return {bgColor,text}
    }

  return (
    <div className={`border-gray-300 border-2 px-3 py-2 rounded-lg flex justify-between items-center mb-2 ${getBidInfo().bgColor}`}>
        <div className="flex flex-col">
            <span className="text-gray-700 text-sm font-semibold">Bidder: {bid.bidder}</span>
            <span className="text-gray-700 text-sm ">Time: {
                // new Date(bid.bidTime).toLocaleString() // Js way
               format(bid.bidTime,"dd MMM yyyy h:mm:ss a")   // Date-fns way(Better)
                }</span>
        </div>
        <div className="flex flex-col text-right">
            <div className="text-xl font-bold">{numberWithCommas(bid.amount)} sek</div>
            <div className="flex flex-row items-center">
                <span>{getBidInfo().text}</span>
            </div>
        </div>
      
    </div>
  )
}

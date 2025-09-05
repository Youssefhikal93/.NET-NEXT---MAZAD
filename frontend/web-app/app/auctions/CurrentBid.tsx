import { numberWithCommas } from "../_lib/numberWithComma";

type Props={
    amount?:number;
    reservePrice: number;


}
export default function CurrentBid({amount,reservePrice}:Props) {
    const text = amount ? `${numberWithCommas(
      
      amount)} sek` : "No bids";
    const color = amount ? amount > reservePrice ? "bg-green-600" : "bg-amber-600" : "bg-red-800"
    return(

    <div className={`border-0 border-white text-white px-2 rounded-md flex justify-center ${color}`}>
    <span className={`${text === "No bids" ? "font-semibold font-mono" : ""}`}>{text}</span>  
    </div>
    )
  
}

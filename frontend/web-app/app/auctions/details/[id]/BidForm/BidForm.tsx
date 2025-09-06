"use client"

import { placeBidForAuction } from "@/app/_lib/actions/auctions";
import { numberWithCommas } from "@/app/_lib/numberWithComma";
import { useBidStore } from "@/app/hooks/useBisStore";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
    auctionId: string;
    highBid:number;
onSuccess: () => void;
}

export default function BidForm({auctionId,highBid,onSuccess}:Props) {
  const {register,handleSubmit,reset}=useForm();
  const addBid = useBidStore(state=>state.addBid);

  function onSubmit(data:FieldValues){
    placeBidForAuction(auctionId,+data.amount)
        .then(bid=>{
            if(bid.error) {
                reset();
                throw bid.error;
            } 
            addBid(bid)
            reset();
             toast.success("Your bid was placed successfully!");
                onSuccess(); 
        }).catch(error=>toast.error(`${error.message}`))
  }

    return (
    <form  id="bidForm" onSubmit={handleSubmit(onSubmit)} className="flex items-center border-2 rounded-lg py-2">
        <input type="number" {...register('amount')} className="input-custom" min={highBid+1} placeholder={`Enter you bid (Min bid is ${numberWithCommas(highBid+1)}) SEK`}
        />
    </form>
  )
}

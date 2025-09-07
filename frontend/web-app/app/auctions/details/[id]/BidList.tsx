"use client"
import { Bid, IAuction } from "@/app/types/types"
import BidItem from "./BidItem"
import { User } from "next-auth"
import {  useEffect, useState } from "react"
import { useBidStore } from "@/app/hooks/useBisStore"
import { getBidsForAuction } from "@/app/_lib/actions/auctions"
import toast from "react-hot-toast"
import LoaderSpinner from "@/app/Components/LoaderSpinner"
import { numberWithCommas } from "@/app/_lib/numberWithComma"
import EmptyFilter from "@/app/Components/EmptyFilter"
import { Button } from "flowbite-react"
import BidModal from "@/app/Components/BidModal"
import BidForm from "./BidForm/BidForm"

type Props={
  user:User | null ;
  auction : IAuction
}

export default function BidList({user,auction}:Props) {
  const [loading,setLoading]=useState(true);
  const [openModal, setOpenModal] = useState(false);
  const bids = useBidStore(state=>state.bids);
  const setBids = useBidStore(state=>state.setBids);
  const open = useBidStore(state=>state.open);
  const setOpen = useBidStore(state=>state.setOpen);
  const openForBids = new Date(auction.auctionEnd) > new Date();

  const highBid = bids.reduce((acc,bid)=>acc>bid.amount 
  ? acc 
  : bid.bidStatus.includes("Accepted")? bid.amount : acc,0)

  useEffect(()=>{
    getBidsForAuction(auction.id)
      .then((res:any)=>{
        if(res.error){
          throw res.error
        }
        setBids(res as Bid[])
      }).catch(error=> {
        toast.error(error.message);
      })
      .finally(()=>setLoading(false));
      
  },[auction.id, setBids])

  useEffect(()=>{
    setOpen(openForBids)
  },[openForBids, setOpen])


  if(loading) return <LoaderSpinner>{"Loading Bids..."}</LoaderSpinner>

  return (
    <>
    <div className="flex justify-between items-center top-0 bg-gray-50 shadow-2xl p-2 text-center">
          <h1 className="font-extrabold text-gray-800 uppercase ">{`Current high bid (${numberWithCommas(highBid)}) sek`}</h1>
          
          <Button size="xs" color={"dark"} onClick={() => setOpenModal(true)}
            disabled={!user ||  user && user.username == auction.seller || !open}
            >{!openForBids ? "Auction Finshed": !user ? "login to place a a bid"  : user && user.username === auction.seller ? "Its your auction dude 😁" :"Place a bid"}</Button>
        </div>
    <div className="border-0 shadow-md rounded-2xl p-2 bg-gray-100 overflow-y-auto md:max-h-[60vh]">

      <div className="py-2 px-4 bg-gray-50">
        
      </div>
      {bids.length==0 ? <EmptyFilter title="No bids for this item" subtitle="Please feel free to make a bid"/> : 
            bids.map(bid=>( 
              <BidItem key={bid.id} bid={bid}></BidItem>
            ))
          }
            </div>
                  <BidModal openModal={openModal} setOpenModal={setOpenModal}>
                     <BidForm auctionId={auction.id} highBid={highBid} onSuccess={() => setOpenModal(false)}/>
                  </BidModal>
    </>
  )
}

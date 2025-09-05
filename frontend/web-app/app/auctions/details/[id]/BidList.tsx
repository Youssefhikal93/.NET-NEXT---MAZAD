"use client"
import { Bid, IAuction } from "@/app/types/types"
import BidItem from "./BidItem"
import { User } from "next-auth"
import { SetStateAction, useEffect, useState } from "react"
import { useBidStore } from "@/app/hooks/useBisStore"
import { getBidsForAuction } from "@/app/_lib/actions/auctions"
import toast from "react-hot-toast"
import LoaderSpinner from "@/app/Components/LoaderSpinner"
import Heading from "@/app/Components/Heading"
import { numberWithCommas } from "@/app/_lib/numberWithComma"
import EmptyFilter from "@/app/Components/EmptyFilter"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react"
import BidModal from "@/app/Components/BidModal"
import BidForm from "./BidForm/BidForm"
import Logo from "@/app/nav/Logo"

type Props={
  user:User | null ;
  auction : IAuction
}

export default function BidList({user,auction}:Props) {
  const [loading,setLoading]=useState(true);
  const [openModal, setOpenModal] = useState(false);
  const bids = useBidStore(state=>state.bids);
  const setBids = useBidStore(state=>state.setBids);

  const highBid = bids.reduce((acc,bid)=>acc>bid.amount ? acc : bid.amount,0)

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

  if(loading) return <LoaderSpinner>{"Loading Bids..."}</LoaderSpinner>

  return (
    <>
    <div className="flex justify-between items-center top-0 bg-gray-50 shadow-2xl p-2 text-center">
          <h1 className="font-extrabold text-gray-800 uppercase ">{`Current high bid (${numberWithCommas(highBid)}) sek`}</h1>
          <Button size="xs" color={"dark"} onClick={() => setOpenModal(true)}>Place a bid</Button>
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
             {/* <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <ModalHeader>
                        <Logo/> 
                    </ModalHeader>
                    <ModalBody>
                      <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                          Place a Bid...
                        </p>
                        <BidForm auctionId={auction.id} highBid={highBid} onSuccess={() => setOpenModal(false)}/>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color={"red"} type="submit" form="bidForm" onClick={() => {
                        
                      }}>Submit your bid</Button>
                      <Button color="alternative" onClick={() => setOpenModal(false)}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal> */}
                  <BidModal openModal={openModal} setOpenModal={setOpenModal}>
                     <BidForm auctionId={auction.id} highBid={highBid} onSuccess={() => setOpenModal(false)}/>
                  </BidModal>
    </>
  )
}

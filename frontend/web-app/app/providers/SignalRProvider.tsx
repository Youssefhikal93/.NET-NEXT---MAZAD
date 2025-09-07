"use client"
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { useAuctionsStore } from '../hooks/useAuctions';
import { useBidStore } from '../hooks/useBisStore';
import { useParams } from 'next/navigation';
import { AuctionFinsihed, Bid, IAuction } from '../types/types';
import { User } from 'next-auth';
import toast from 'react-hot-toast';
import AuctionCreatedToast from '../Components/AuctionCreatedToast';
import { getAuctionById } from '../_lib/actions/auctions';
import { Spinner } from 'flowbite-react';
import AuctionFinishedToast from '../Components/AuctionFinishedToast';

type Props={
children: ReactNode
user: User | null
};

export default function SignalRProvider({children,user}:Props) {
  const connection = useRef<HubConnection|null>(null)
  const setCurrentPrice = useAuctionsStore(state=>state.setCurrentPrice)
  const addBid = useBidStore(state=>state.addBid);
  const params = useParams<{id:string}>();

  const handelBidPlaced = useCallback((bid:Bid)=>{
        if(bid.bidStatus.includes("Accepted")){
            setCurrentPrice(bid.auctionId,bid.amount)
        }
        if(params.id === bid.auctionId){
            addBid(bid);
        }
  },[addBid, params.id, setCurrentPrice])

  const handelAuctionCreated = useCallback((auction:IAuction)=>{
        if(auction.seller !== user?.username){
            return toast(<AuctionCreatedToast auction={auction} />, {duration:10000})
        }
  },[user?.username])

const handelAuctionFinished =useCallback((finishedAuction:AuctionFinsihed)=>{
        const auction = getAuctionById(finishedAuction.auctionId);

        // hot toasts can deal with promises without consuming them
        return toast.promise<IAuction>(auction, 
          {loading:"loading" , 
            success:(auction)=><AuctionFinishedToast finishedAuction={finishedAuction} auction={auction}/>,
          error:(err)=> "Auction error"}, {duration:10000,icon:null})
          
  },[])

  useEffect(()=>{
    if(!connection.current){
        const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:6001/notifications")
        .withAutomaticReconnect()
        .build();

        connection.current = newConnection
        connection.current.start()
        .then(()=>console.log("conntect to notificationHub"))
        .catch(()=>console.log("error connecting to notificationHub"))
    }

    connection.current.on("BidPlaced",handelBidPlaced)
    connection.current.on("AuctionCreated",handelAuctionCreated)
    connection.current.on("AuctionFinished",handelAuctionFinished)

    return ()=> {
        connection.current?.off("BidPlaced",handelBidPlaced)
        connection.current?.off("AuctionCreated",handelAuctionCreated)
        connection.current?.off("AuctionFinished",handelAuctionFinished)
    }
  },[handelAuctionCreated, handelAuctionFinished, handelBidPlaced])

  return (
    <div>
      {children}
    </div>
    // children  // or just chidlren withount any placholders
  )
}

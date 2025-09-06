"use client"
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { useAuctionsStore } from '../hooks/useAuctions';
import { useBidStore } from '../hooks/useBisStore';
import { useParams } from 'next/navigation';
import { Bid } from '../types/types';

type Props={
children: ReactNode
};

export default function SignalRProvider({children}:Props) {
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

    return ()=> {
        connection.current?.off("BidPlaced",handelBidPlaced)
    }
  },[handelBidPlaced])

  return (
    <div>
      {children}
    </div>
    // children  // or just chidlren withount any placholders
  )
}

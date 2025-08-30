"use client"
import { IAuction } from "@/types"
import Image from "next/image"
import { useState } from "react"

type Props = {
    auction:IAuction
}

export default function CardImage({auction}:Props) {
    const [loading,setLoading] = useState(true);
  return (
       <Image 
            src={auction.imageUrl}
            alt={auction.model}
            fill
            priority
            quality={75}
            sizes="(max-width:768px) 100vw,(max-width:1200px)50vw,25vw"
            // placeholder="blur"
            className={`object-cover rounded-lg duration-900 ease-in-out  ${loading ? "opacity-0 scale-110 blur-2xl":"opacity-100 scale-100"}`}
            onLoad={()=>setLoading(false)}/>
            
    
  )
}

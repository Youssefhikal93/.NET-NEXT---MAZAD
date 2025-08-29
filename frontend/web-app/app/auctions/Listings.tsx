"use client";
import { IAuction } from "@/types";
import AuctionCard from "./AuctionCard";
import AppPagination from "../Components/AppPagination";
import { getAuctions } from "@/_lib/actions/auctions";
import { useEffect, useState } from "react";
import Filter from "./Filter";




export default  function Listings() {
    const [auctions,setAuctions]=useState<IAuction[]>([]);
    const [pageCount,setPageCount]=useState(1);
    const [pageNumber,setPageNumber]=useState(1);
    const [pageSize,setPageSize]=useState(4);

    useEffect( () => {
    
    getAuctions(pageNumber,pageSize).then(data=>{
      setAuctions(data.results);
      setPageCount(data.pageCount)
    });

   
},[pageNumber, pageSize])

  if(!auctions) return <h3>Loading...</h3>

  return (
    <>
    <Filter pageSize={pageSize} setPageSize={setPageSize}/>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      { auctions &&
        auctions.map((auction:IAuction)=> 
          ( <AuctionCard auction={auction} key={auction.id}/>)
      )
    }
    </div>
    <div className="flex justify-center align-center">
      <AppPagination  OnpageChanged={setPageNumber}  pageCount={pageCount} currentPage={pageNumber}/>
    </div>
    </>
  )
}

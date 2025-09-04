"use client";
import { IAuction, pagedResult } from "@/app/types/types";
import AuctionCard from "./AuctionCard";
import AppPagination from "../Components/AppPagination";
import { getAuctions } from "@/app/_lib/actions/auctions";
import { useEffect, useState } from "react";
import Filter from "./Filter";
import { useParamsStore } from "../hooks/useParamsStore";
import { useShallow } from "zustand/shallow";
import queryString from "query-string";
import EmptyFilter from "../Components/EmptyFilter";
import { Spinner } from "flowbite-react";




export default  function Listings() {
    const [data,setData]=useState<pagedResult<IAuction>>();

  const params = useParamsStore(useShallow( state=>({
    pageNumber:state.pageNumber,
    pageSize:state.pageSize,
    searchTerm:state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy,
    seller: state.seller,
    winner: state.winner
  })));
  const setParams = useParamsStore(state=>state.setParams)
  const url = queryString.stringifyUrl({url:"",query:params},{skipEmptyString:true})

  function setPageNumber(pageNumber:number){
    setParams({pageNumber});
  }

    useEffect( () => {
    
    getAuctions(url).then(data=>{
      setData(data)
    });

   
},[url])

  if(!data) return (
    <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col justify-center items-center">
            <Spinner color="failure" size="xl"/> 
            <p className="mt-2 text-red-900 text-xs">Loading Auctions...</p>
        </div>
    </div>
  ) 

  return (
    <>
    <Filter />
    {data.totalCount===0 ?  <EmptyFilter showReset/> :
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      { data &&
        data.results.map((auction:IAuction)=> 
          ( <AuctionCard auction={auction} key={auction.id}/>)
      )
    }
    </div>
    }

    <div className="flex justify-center align-center">
      <AppPagination  OnpageChanged={setPageNumber}  pageCount={data.pageCount} currentPage={params.pageNumber}/>
    </div>
    </>
  )
}

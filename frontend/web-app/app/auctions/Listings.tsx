"use client";
import { IAuction, pagedResult } from "@/types";
import AuctionCard from "./AuctionCard";
import AppPagination from "../Components/AppPagination";
import { getAuctions } from "@/app/_lib/actions/auctions";
import { useEffect, useState } from "react";
import Filter from "./Filter";
import { useParamsStore } from "../hooks/useParamsStore";
import { useShallow } from "zustand/shallow";
import queryString from "query-string";
import EmptyFilter from "../Components/EmptyFilter";




export default  function Listings() {
    const [data,setData]=useState<pagedResult<IAuction>>();

  const params = useParamsStore(useShallow( state=>({
    pageNumber:state.pageNumber,
    pageSize:state.pageSize,
    searchTerm:state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy
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

  if(!data) return <h3>Loading...</h3>

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

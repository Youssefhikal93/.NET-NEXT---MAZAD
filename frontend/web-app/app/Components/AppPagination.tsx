"use client";
import { Pagination } from "flowbite-react";

type Props ={
    currentPage: number; 
    pageCount: number;
    OnpageChanged: (page:number)=>void;
}


export default function AppPagination({currentPage,pageCount,OnpageChanged}:Props) {

  return (
    <div>
      <Pagination 
      currentPage={currentPage} 
      totalPages={pageCount} 
      onPageChange={e=>OnpageChanged(e)} 
    //   onPageChange={onPageChange}
      showIcons={true}
      layout="pagination"
      className="text-gray-800"
      />
    </div>
  )
}

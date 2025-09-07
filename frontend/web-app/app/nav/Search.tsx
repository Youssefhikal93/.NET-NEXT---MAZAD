"use client";
import { FaSearch } from "react-icons/fa";
import { useParamsStore } from "../hooks/useParamsStore";
import {  useEffect, useState } from "react";

export default function Search() {
    const setParams= useParamsStore(state=>state.setParams);
    const searchTerm = useParamsStore(state=>state.searchTerm)
    const [value,setValue]=useState("")

    useEffect(()=>{
        if(searchTerm==="") setValue("")
    },[searchTerm])

    function handelSearch(){
        console.log(value)
        setParams({searchTerm: value})
        
    }

  return (
        <div className='flex w-fit items-center border-0 rounded-full py-2 shadow-sm border-b-2'>
            <input
            onKeyDown={(e)=> {
                if(e.key === "Enter"){
                    handelSearch();
                }
            } }
             value={value}
            onChange={(e) => setValue(e.target.value)}
                type="text"
                placeholder='Search for cars ....'
                className='
                flex-grow
                pl-5
                bg-transparent
                focus:outline-none
                border-transparent
                focus:border-transparent
                focus:ring-0
                text-sm
                text-gray-600
            '
            />
            <button onClick={handelSearch} >
                <FaSearch
                    size={34}
                    className='bg-gray-800 text-white rounded-full p-2 cursor-pointer mx-2' />
            </button>
        </div>
    )
}
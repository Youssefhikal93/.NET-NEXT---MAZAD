"use server";
import { IAuction, pagedResult } from "@/types";

export async function getAuctions(pageNumber:number,pageSize:number):Promise<pagedResult<IAuction>>{
    const res = await fetch(`http://localhost:6001/search?pageSize=${pageSize}&pageNumber=${pageNumber}`)
    
    if(!res.ok) throw new Error("Failed to fetch data!")
        return res.json();
    }
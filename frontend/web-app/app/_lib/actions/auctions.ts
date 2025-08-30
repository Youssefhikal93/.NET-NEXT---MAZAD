"use server";
import { IAuction, pagedResult } from "@/app/types/types";
import { auth } from "@/auth";

export async function getAuctions(query: string): Promise<pagedResult<IAuction>> {
    const res = await fetch(`http://localhost:6001/search${query}`);

    if (!res.ok) throw new Error('Failed to fetch data');

    return res.json();
}

export async function updateAuctointest():Promise<{status:number,message:string}>{
    const data = {
        milage: Math.floor(Math.random()*1000)+1
    }

    const session = await auth();

    const res = await fetch(`http://localhost:6001/auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c`, {
        method:"PUT",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`
        },
        body:JSON.stringify(data)
    })
    if(!res.ok) return {status:res.status,message:res.statusText} 

    return {status:res.status,message:res.statusText}
}
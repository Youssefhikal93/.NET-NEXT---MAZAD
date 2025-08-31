"use server";
import { IAuction, pagedResult } from "@/app/types/types";

import { fetchWrapper } from "../fetchWrapper";
import { FieldValues } from "react-hook-form";



export async function getAuctions(query: string): Promise<pagedResult<IAuction>> {
   return fetchWrapper.get(`search${query}`)
}

export async function createAuction(data:FieldValues){
    return fetchWrapper.post("auctions",data)
}

export async function getAuctionById(id:string):Promise<IAuction> {
    return fetchWrapper.get(`auctions/${id}`)
}

export async function updateAuction(id:string,data:FieldValues) {
    return fetchWrapper.put(`auctions/${id}`,data)
}
export async function deleteAuction(id:string) {
    return fetchWrapper.del(`auctions/${id}`)
}


export async function updateAuctointest():Promise<{status:number,message:string}>{
    const data = {
        milage: Math.floor(Math.random()*1000)+1
    }

    return fetchWrapper.put("auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c",data)
}

// export async function getAuctions(query: string): Promise<pagedResult<IAuction>> {
//     const res = await fetch(`http://localhost:6001/search${query}`);

//     if (!res.ok) throw new Error('Failed to fetch data');

//     return res.json();
// }

// export async function updateAuctointest():Promise<{status:number,message:string}>{
//     const data = {
//         milage: Math.floor(Math.random()*1000)+1
//     }

//     const session = await auth();

//     const res = await fetch(`http://localhost:6001/auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c`, {
//         method:"PUT",
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${session?.accessToken}`
//         },
//         body:JSON.stringify(data)
//     })
//     if(!res.ok) return {status:res.status,message:res.statusText} 

//     return {status:res.status,message:res.statusText}
// }
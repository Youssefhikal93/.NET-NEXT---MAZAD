"use server";
import { IAuction, pagedResult } from "@/app/types/types";

export async function getAuctions(query: string): Promise<pagedResult<IAuction>> {
    const res = await fetch(`http://localhost:6001/search${query}`);

    if (!res.ok) throw new Error('Failed to fetch data');

    return res.json();
}
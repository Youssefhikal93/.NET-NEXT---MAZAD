"use server"

import { auth } from "@/auth"

export async function getCurrentUser(){
    const session = await auth();

    if(!session) return; 

    return session.user;
}
"use client"

import { Button, Spinner } from "flowbite-react"
import { useState } from "react"
import { updateAuctointest } from "../_lib/actions/auctions"

export default function AuthTest() {
    const [loading,setLoaing]=useState(false)
    const [result,setResult]=useState<{status:number,message:string} | null> (null)

    function handelUpdate(){
        setResult(null);
        setLoaing(true)
        updateAuctointest().then(data=>setResult(data))
            .catch(err=>setResult(err))
            .finally(()=>setLoaing(false))
    }
  return (
    <div className="flex items-center gap-4">

    <Button 
    outline 
    color="gray" 
    disabled={loading}
     onClick={handelUpdate} >
       {loading ? <Spinner size="sm"  color="failure"/>: "Test Auth"}
    </Button>
    <div>
        {JSON.stringify(result,null,2)}
    </div>
    </div>
  )
}

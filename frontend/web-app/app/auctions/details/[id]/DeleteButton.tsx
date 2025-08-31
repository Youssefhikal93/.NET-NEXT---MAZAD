"use client"
import { deleteAuction } from '@/app/_lib/actions/auctions';
import { Button, Spinner } from 'flowbite-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import DeleteModal from './DeleteModal';
type Props = {
    id:string
}
export default function DeleteButton({id}:Props) {
    const [loading,setLoading]=useState(false);
     const [openModal, setOpenModal] = useState(true);
    const router = useRouter()

    function handelDelete(){
        setLoading(true)
        
       const result = confirm("are you sure that you want to delete?");
        if (result) {
    //Logic to delete the item

             deleteAuction(id).then(res=>{
                if(res.error){

                    toast.error(res.error.message)
                }
                router.push("/")
                toast.success("Auction deleted!")
            })
        
        .catch (error=>{

            toast.error(error.status + error.message)
        })
        
        .finally(()=> setLoading(false))
           
    }
}
  return (
     <Button  color="red" onClick={(handelDelete)}>
        {loading && <Spinner size='sm'/>}
        Delete Auction 
    </Button>
  )
}

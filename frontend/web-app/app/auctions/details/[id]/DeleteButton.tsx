"use client"
import { deleteAuction } from '@/app/_lib/actions/auctions';
import { Button, Modal, ModalBody, ModalHeader, Spinner } from 'flowbite-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { HiOutlineExclamationCircle } from "react-icons/hi";

type Props = {
    id:string
}
export default function DeleteButton({id}:Props) {
    const [loading,setLoading]=useState(false);
     const [openModal, setOpenModal] = useState(false);
    const router = useRouter()

    function handelDelete(){
        setLoading(true)
        
        //in case window confirm is required
    //    const result = confirm("are you sure that you want to delete?");
    //     if (result) {
        // }

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
  return (
    <>
     <Button  color="red" onClick={() => setOpenModal(true)}>
        {loading && <Spinner size='sm'/>}
        Delete Auction 
    </Button>
 <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handelDelete}>
                Yes, I&apos;m sure
              </Button>
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

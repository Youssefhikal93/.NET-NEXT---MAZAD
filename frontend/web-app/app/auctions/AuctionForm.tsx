/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button, Spinner} from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form"
import Input from "../Components/Input";
import { useEffect } from "react";
import DateInput from "../Components/DateInput";

import { createAuction, updateAuction } from "../_lib/actions/auctions";

import toast from "react-hot-toast";
import { IAuction } from "../types/types";

type Props = {
  auction?:IAuction
}

export default function AuctionForm({auction}:Props) {
  const router = useRouter();
  const pathname = usePathname();
    const {control,
    handleSubmit,setFocus,reset,
    formState:{isValid,isDirty,isSubmitting}} = useForm({
     mode:"onTouched"
    });

    async function onSubmit(data:FieldValues){
      console.log(data)
      try {
        let id = "";
        let res;
        if(pathname=== "/auctions/create"){
         res = await createAuction(data);
          id = res.id;
          toast.success("Auction Created!")
        } else {
          if(auction){

            res = await updateAuction(auction?.id,data);
            id = auction.id;
             toast.success("Auction Updated!")
          }
        }

        if(!res) throw res.error
          router.push(`/auctions/details/${id}`)
         
      }catch(error:any){
        console.log(error)
          toast.error(`${error.status}: ${error.message}`)
      }
    }

    useEffect(()=>{
      if(auction){
        const {make,model,color,mileage,year}= auction;
        reset({make,model,color,mileage,year})
      }

      setFocus("make")
    },[auction, reset, setFocus])

  return (
    <form className="flex flex-col mt-3 py-5 px-3" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Make" name="make" control={control} rules={{required:"Make is required!"}}/>

      <Input label="Model" name="model" control={control} rules={{required:"Model is required!"}}/>

       <Input label="Color" name="color" control={control} rules={{required:"Color is required!"}}/>

       <div className="grid grid-cols-2 gap-3">
      <Input label="Year" name="year" type="number" control={control} rules={{required:"Year is required!"}}/>
      <Input label="Mileage" name="mileage" type="number" control={control} rules={{required:"Mileage is required!"}}/>
      </div>

      {pathname=== "/auctions/create" &&
    <>
       <div className="grid grid-cols-2 gap-3">
        {/* <Input label="Auction end date/time" name="auctionEnd" type="datetime-local" control={control} rules={{required:"Auction end date/time is required!"}}/> */}
       <DateInput 
       label="Auction end date/time" 
       name="auctionEnd"  
       control={control}
       rules={{required:"Auction end date/time is required!"}}
       showTimeSelect
       dateFormat={"dd MMMM yyyy h:mm"}
       showIcon 
       
       />
      
      <Input label="Reserver price or 0 w Date.nowif no reserve" name="reservePrice" type="number" control={control} rules={{required:"Reserver price is required!"}}/>
       </div>
       <Input label="Image URL" name="imageUrl" control={control} rules={{required:"Image price is required!"}}/>
       </>
      }


      <div className="flex justify-between">
    <Button  color="light" onClick={()=>router.push("/")}>Cancel</Button>
     <Button  
     color="dark" 
     type="submit"
     disabled={!isValid || !isDirty}
   
     >  {isSubmitting ? <Spinner size="sm" color="failure"/> : "Submit"}</Button>
      </div>
    </form>
  )
}

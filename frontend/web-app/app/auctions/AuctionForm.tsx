"use client"
import { Button, Spinner} from "flowbite-react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form"
import Input from "../Components/Input";
import { useEffect } from "react";
import DateInput from "../Components/DateInput";


export default function AuctionForm() {
  const router = useRouter();
    const {control,
    handleSubmit,setFocus,
    formState:{isValid,isDirty,isSubmitting}} = useForm({
     mode:"onTouched"
    });

    function onSubmit(data:FieldValues){
      console.log(data)
    }

    useEffect(()=>{
      setFocus("make")
    },[setFocus])

  return (
    <form className="flex flex-col mt-3 py-5 px-3" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Make" name="make" control={control} rules={{required:"Make is required!"}}/>

      <Input label="Model" name="model" control={control} rules={{required:"Model is required!"}}/>

       <Input label="Color" name="color" control={control} rules={{required:"Color is required!"}}/>

       <div className="grid grid-cols-2 gap-3">
      <Input label="Year" name="year" type="number" control={control} rules={{required:"Year is required!"}}/>
      <Input label="Mileage" name="mileage" type="number" control={control} rules={{required:"Mileage is required!"}}/>
      </div>

       <div className="grid grid-cols-2 gap-3">
        <Input label="Auction end date/time" name="endDate" type="datetime-local" control={control} rules={{required:"Auction end date/time is required!"}}/>
         {/* <DateInput 
       label="Auction end date/time" 
       name="endDate"  
       control={control}
       rules={{required:"Auction end date/time is required!"}}
       showTimeSelect
       dateFormat={"dd MMMM yyyy h:mm"}
       showIcon 
       /> */}
      <Input label="Reserver price or 0 if no reserve" name="reservePrice" type="number" control={control} rules={{required:"Reserver price is required!"}}/>
       </div>
      

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

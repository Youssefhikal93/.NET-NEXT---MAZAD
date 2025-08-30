"use client"
import { AiOutlineCar } from "react-icons/ai";
import { useParamsStore } from "../hooks/useParamsStore";
import { usePathname, useRouter } from "next/navigation";


export default function Logo() {
  const reset = useParamsStore(state=>state.reset)
const router = useRouter()
const pathname = usePathname();

function handleReset(){
  if(pathname !== "/") router.push("/");
  reset();
}

   return (
   
    <div onClick={handleReset} className='flex items-center gap-2 text-sm md:text-2xl font-semibold text-red-900 cursor-pointer'>
         <AiOutlineCar size={34}/>
         <div>Mazad</div>
           </div>
   
  )
  // return (
  //   <Link href="/">
  //   <div onClick={reset} className='flex items-center gap-2 text-sm md:text-2xl font-semibold text-red-900 cursor-pointer'>
  //        <AiOutlineCar size={34}/>
  //        <div>Mazad</div>
  //          </div>
  //    </Link>
  // )
}

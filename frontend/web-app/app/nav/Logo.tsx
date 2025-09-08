"use client"
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
         <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M6 13.5V5.5C6 4.39543 6.89543 3.5 8 3.5H9.5C10.6046 3.5 11.5 4.39543 11.5 5.5V13.5M6 13.5H18M6 13.5V18.5C6 19.6046 6.89543 20.5 8 20.5H16C17.1046 20.5 18 19.6046 18 18.5V13.5M18 13.5V9.5C18 8.39543 17.1046 7.5 16 7.5H14.5C13.3954 7.5 12.5 8.39543 12.5 9.5V13.5M11.5 13.5H12.5M11.5 13.5V16.5M12.5 13.5V16.5" stroke="#8B0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
         <span className="text-gray-700">Mazad Auctions</span>
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

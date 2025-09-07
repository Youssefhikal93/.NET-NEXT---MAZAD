"use client"
import Countdown, { zeroPad } from "react-countdown";
import { useBidStore } from "../hooks/useBisStore";
import { usePathname } from "next/navigation";


const renderer = ({ days,hours, minutes, seconds, completed }:{days:number, hours:number, minutes:number, seconds:number, completed:boolean }) => {

    return (
        <div className={
            `border-2 border-amber-50 text-white py-1 px-2 rounded-lg flex justify-center ${completed ? "bg-red-700": (days===0 && hours<10)? "bg-amber-700":"bg-green-700"}`
        }>

            {completed ?( 
        <span>Auction finished</span>) :   (
            
            //in case warinign appeared says that it doffers server from the client 
            
              days > 1 ?  <span suppressHydrationWarning={true}>{days} Days left</span>:
            
            <span suppressHydrationWarning={true}>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)} left</span>
        )
        }

        </div>
    )

 
}
  type Props = {
    auctionEnd : string;
  }

export default function CountDownTimer({auctionEnd}:Props) {
  const setOpen = useBidStore(state=>state.setOpen);
  const pathname = usePathname();

  function auctionFinished(){
    if(pathname.startsWith("/auction/details")) {
        setOpen(false)
    }
  }

  return (
    <div>
      
      <Countdown date={auctionEnd} renderer={renderer} onComplete={auctionFinished}/>
    </div>
  )
}

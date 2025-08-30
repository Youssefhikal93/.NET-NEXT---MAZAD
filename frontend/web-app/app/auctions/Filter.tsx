import { Button, ButtonGroup } from "flowbite-react";
import { useParamsStore } from "../hooks/useParamsStore";
import { AiOutlineClockCircle, AiOutlineSortAscending } from "react-icons/ai";
import {BsFillStopCircleFill, BsStopwatchFill} from "react-icons/bs"
import {GiFinishLine, GiFlame} from "react-icons/gi"
// type Props = {
//     pageSize: number;
//     setPageSize:(pageSize:number)=>void;
// }
const pageSizeButtons = [4,8,12]
const orderButtons = [
    {label:"Alphabitcal " , icon:AiOutlineSortAscending , value:"make"},
    {label:"End date" , icon:AiOutlineClockCircle , value:"endingSoon"},
    {label:"Recently added" , icon: BsFillStopCircleFill , value:"new"},
]
const filterButtons = [
    {label:"Live Auctions" , icon:GiFlame , value:"live"},
    {label:" < 6 hours" , icon:GiFinishLine, value:"endingSoon"},
    {label:"Completed" , icon: BsStopwatchFill , value:"finished"},
]
export default function Filter() {

    const pageSize = useParamsStore(state=>state.pageSize);
    const setParams = useParamsStore(state=>state.setParams)
    const orderBy = useParamsStore(state=>state.orderBy);
    const filterBy = useParamsStore(state=>state.filterBy);

  return (
    <div className="grid-row-3 gap-3 md:flex justify-between items-center mb-4 max-w-screen">
        <div className="grid grid-rows-2 gap-4">

        <div>
       <span className='uppercase text-sm text-gray-500 mr-2'>Filter by</span>
                <ButtonGroup outline>
                    {orderButtons.map(({label, icon:Icon,value}) => (
                        <Button key={value}
                            onClick={() => setParams({orderBy:value})}
                            color={`${orderBy === value ? 'red' : 'gray'}`}
                            className='focus:ring-0'
                        >
                            <Icon className="h-4 w-3 mr-3"/>
                                                       <span className="text-xs md:text-lg">{label}</span> 

                        </Button>
                    ))}
                </ButtonGroup>
        </div>
        {/* FIlters */}
         <div>
       <span className='uppercase text-sm text-gray-500 mr-2'>Order By</span>
                <ButtonGroup outline>
                    {filterButtons.map(({label, icon:Icon,value}) => (
                        <Button key={value}
                            onClick={() => setParams({filterBy:value})}
                            color={`${filterBy === value ? 'red' : 'gray'}`}
                            className='focus:ring-0'
                        >
                            <Icon className="h-4 w-4 mr-3"/>
                           <span className="text-xs md:text-lg">{label}</span> 
                        </Button>
                    ))}
                </ButtonGroup>
        </div>
         </div>
                <div className="mt-5">
                <span className='uppercase text-sm text-gray-500 mr-2'>Page size</span>
                <ButtonGroup outline>
                    {pageSizeButtons.map((el, i) => (
                        <Button key={i}
                            onClick={() => setParams({pageSize:el})}
                            color={`${pageSize === el ? 'red' : 'gray'}`}
                            className='focus:ring-0'
                        >
                                                      <span className="text-xs md:text-lg">{el}</span> 

                        </Button>
                    ))}
                </ButtonGroup>
                 </div>
    </div>
  )
}

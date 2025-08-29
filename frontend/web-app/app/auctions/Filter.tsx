import { Button, ButtonGroup } from "flowbite-react";
import { useParamsStore } from "../hooks/useParamsStore";

// type Props = {
//     pageSize: number;
//     setPageSize:(pageSize:number)=>void;
// }
const pageSizeButtons = [4,8,12]
export default function Filter() {

    const pageSize = useParamsStore(state=>state.pageSize);
    const setParams = useParamsStore(state=>state.setParams)

  return (
    <div className="flex justify-between items-center mb-4">
     <div>
                <span className='uppercase text-sm text-gray-500 mr-2'>Page size</span>
                <ButtonGroup outline>
                    {pageSizeButtons.map((el, i) => (
                        <Button key={i}
                            onClick={() => setParams({pageSize:el})}
                            color={`${pageSize === el ? 'red' : 'gray'}`}
                            className='focus:ring-0'
                        >
                            {el}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
    </div>
  )
}

import { create } from "zustand"
import { IAuction, pagedResult } from "../types/types"


type State = {
    auctions : IAuction[]
    totalCount: number
    pageCount: number
}

type Actions ={ 
    setData: (data:pagedResult<IAuction>) =>void;
    setCurrentPrice : (auctionId:string,amount:number)=>void;
}

const initialState: State= {
     auctions :[],
    totalCount: 0,
    pageCount: 0
}

export const useAuctionsStore = create<State & Actions>((set)=>(
    {
        ...initialState,
        setData:(data:pagedResult<IAuction>)=>{
            set(()=>({
                auctions:data.results,
                totalCount:data.totalCount,
                pageCount:data.pageCount
            }))
        },
        setCurrentPrice:(auctionId:string,amount:number)=>{
            set((state)=>({
                auctions: state.auctions.map((auctionObj)=>auctionObj.id === auctionId ? {...auctionObj,currentHighBid:amount}:{...auctionObj})
            }))
        }
    }
))

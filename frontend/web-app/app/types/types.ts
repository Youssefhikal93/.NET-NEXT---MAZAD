export type pagedResult <T> ={
    results:T[],
    pageCount:number,
    totalCount:number,
    color: string
    auctionEnd:string

id:string
imageUrl:string
make:string
mileage:number
model:string
reservePrice:number
seller:string
soldAmount:number
status:string
updatedAt:string
createDate: string
currentHighBid: number
winner:string
year:number
}

export interface IAuction {
    color: string
    auctionEnd:string
    id:string
    imageUrl:string
    make:string
    mileage:number
    model:string
    reservePrice:number
    seller:string
    soldAmount?:number
    status:string
    updatedAt:string
    createDate: string
    currentHighBid?: number
    winner?:string
    year:number
}

export type Bid = {
     error?: any
     id:string
     auctionId: string
     bidder:string
     bidTime:string
     amount:number
     bidStatus:string
}

export type AuctionFinsihed = {
     itemSold:boolean
     auctionId: string
     winner?:string
     seller:string
     amount?:number
     
}
import { getAuctionById } from '@/app/_lib/actions/auctions';
import Heading from '@/app/Components/Heading';
import React from 'react'
import AuctionForm from '../../AuctionForm';

export default async function Update({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  const data = await getAuctionById(id);
  return (
    <div className='mx-auto max-w[75%] shoadow-lg p-10 rounded-lg'>
      <Heading title={'Update your Auction'} subtitle={'Please update the details of your car (only these auctions can be updated)'}/>
      <AuctionForm auction={data}/>
    </div>
  )
}

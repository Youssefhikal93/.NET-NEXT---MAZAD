import React from 'react'

export default async function Update({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  return (
    <div>
      update auction {id}
    </div>
  )
}

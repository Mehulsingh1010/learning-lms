'use client'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function Bannner() {
    const {user}=useUser();
  return (
    <div className='bg-blue-500 w-full  text-white rounded-lg p-5 flex  gap-6 items-center'>
      <Image src={'/laptop.png'} alt='laptop' width={100} height={100}/>

      <div>
        <h2 className='fond-bold text-3xl'>Hello, {user?.fullName}</h2>
        <p>Welcome back, time to start growing!</p>
      </div>
    </div>
  )
}

export default Bannner

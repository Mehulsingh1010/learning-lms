import Image from 'next/image'
import React from 'react'

function SideBar() {
  return (
    <div className='h-screen shadow-md'>
        <div>
            <Image src={'/logo.svg'} alt='logo'width={40} height={40}/>
            <h2 className='font-bold text-2xl'>Easy Study </h2>
        </div>
      Sidebar
    </div>
  )
}

export default SideBar

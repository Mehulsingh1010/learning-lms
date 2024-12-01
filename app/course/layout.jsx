import React from 'react'
import Headerwithlogo from './[courseId]/_components/Headerwithlogo'

function CouorseLayout({children}) {
  return (
    <div>
         <Headerwithlogo />
      <div className='mx-10 md:mx-36 lg:px-36 mt-10'>
        {children}
      </div>
    </div>
  )
}

export default CouorseLayout

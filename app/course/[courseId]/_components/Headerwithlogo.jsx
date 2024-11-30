import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';

function Headerwithlogo() {
  return (
    <div className="p-5 shadow-md flex justify-between items-center bg-white">
      {/* Logo Section */}
      <div className="flex md:ml-10 items-center gap-3">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <h2 className="font-bold text-2xl text-gray-800">TopperTown</h2>
      </div>

      {/* User Button Section */}
      <div className='md:mr-10'>
        <UserButton />
      </div>
    </div>
  );
}

export default Headerwithlogo;

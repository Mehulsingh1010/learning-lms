'use client'
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LayoutIcon,
  SmartphoneChargingIcon,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";



function SideBar() {
  const menuList = [
    {
      name: 'Dashboard',
      icon: LayoutIcon,
      path: "/dashboard",
    },
    {
      name: 'Upgrade',
      icon: SmartphoneChargingIcon,
      path: "/dashboard/upgrade",
    },
    {
      name: 'Profile',
      icon: UserCircle,
      path: "/dashboard/profile",
    },
  ];
  const {totalCourse, setTotalCourse} =useContext(CourseCountContext);
  const path=usePathname();
  return (
    <div className="h-screen shadow-md p-5">
      <div className="flex gap-2 items-center ">
        <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
        <h2 className="font-bold text-2xl">TopperTown </h2>
      </div>
      <div className="mt-10">
        <Link href={'/create'} > 
        <Button className="w-full">+ Create New</Button></Link>
        <div className='mt-5'>
          {menuList.map((menu, index) => (
            <div key={index} className={`flex items-center p-3 hover:bg-[#DEE4EE] gap-5 rounded-lg cursor-pointer mt-3 ${path==menu.path &&'bg-[#DEE4EE]'}`}>
              <menu.icon />
              <h2>{menu.name}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]'>
        <h2 className='text-lg mb-2'>Available Credits : {(5-totalCourse)}</h2>
          <Progress value={(totalCourse/5)*100}/>
          <h2 className='text-sm'>{totalCourse} out of 5 credits used</h2>

          <Link href={'/dashboard/upgrade'} className='text-primary text-xs mt-3'>Upgrade to create more</Link>
      </div>

    </div>
  );
}

export default SideBar;

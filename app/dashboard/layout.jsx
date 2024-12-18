'use client'
import React,{useState} from "react";
import DashboardHeader from "./_components/DashboardHeader";
import SideBar from "./_components/SideBar";
import { Toaster } from "@/components/ui/sonner";
import {CourseCountContext} from "../_context/CourseCountContext"
const DashbaordLayout = ({ children }) => {

   const [totalCourse, setTotalCourse] = useState(0);


  return (
      <CourseCountContext.Provider value={{totalCourse,setTotalCourse}}>
    <div>
      <div className="md:w-64 hidden md:block fixed">
        <SideBar />
      </div>
      <div className="md:ml-64 shadow-sm">
        <DashboardHeader />
        <Toaster />
        <div className='p-10'>{children}</div>
      </div>
    </div>
    </CourseCountContext.Provider>
  );
};

export default DashbaordLayout;

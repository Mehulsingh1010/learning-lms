import React from "react";
import DashboardHeader from "./_components/DashboardHeader";
import SideBar from "./_components/SideBar";
import { Toaster } from "@/components/ui/sonner";

const DashbaordLayout = ({ children }) => {
  return (
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
  );
};

export default DashbaordLayout;

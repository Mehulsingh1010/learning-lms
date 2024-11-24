import React from "react";
import DashboardHeader from "./_components/DashboardHeader";
import SideBar from "./_components/SideBar";

const DashbaordLayout = ({ children }) => {
  return (
    <div>
      <div className="md:w-64 hidden md:block fixed">
        <SideBar />
      </div>
      <div className="md:ml-64 shadow-sm">
        <DashboardHeader />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashbaordLayout;

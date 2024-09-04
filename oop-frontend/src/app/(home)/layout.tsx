import React from 'react';
import Sidebar from "@/common/components/sidebar/sidebar";

const HomeLayout = ({children}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default HomeLayout;

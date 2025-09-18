import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#000717] text-white flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarFixed from '../components/SidebarFixed';
import NavigationErrorBoundary from '../components/NavigationErrorBoundary';
import '../hot-reload-test'; // Forçar Hot Reload

const MainLayout = () => {
  return (
    <NavigationErrorBoundary>
      <div className="min-h-screen bg-[#000717] text-white flex">
        <SidebarFixed />
        <main className="main-content flex-1 p-4 md:p-6 lg:p-8 transition-all flex flex-col items-center justify-start" style={{ paddingTop: '50px' }}>
          <Outlet />
        </main>
      </div>
    </NavigationErrorBoundary>
  );
};

export default MainLayout;

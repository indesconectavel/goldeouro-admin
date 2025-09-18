import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

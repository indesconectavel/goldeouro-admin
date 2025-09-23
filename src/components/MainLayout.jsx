import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 md:ml-64 transition-all duration-300 p-6">
        <div className="card" style={{
          padding: '2rem',
          minHeight: 'calc(100vh - 3rem)'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

import React from 'react';
import DashboardCards from '../components/DashboardCards';

const Dashboard = () => {
  return (
    <div className="bg-[#000717] p-8 rounded shadow-md max-w-7xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Painel de Controle</h1>
      
      <p className="text-sm text-center text-gray-400 mb-8">
        Dashboard em tempo real conectado ao backend
      </p>

      {/* Componente DashboardCards com dados do endpoint público */}
      <DashboardCards />
    </div>
  );
};

export default Dashboard;

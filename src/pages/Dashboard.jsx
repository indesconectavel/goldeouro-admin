import React from 'react';
import DashboardCards from '../components/DashboardCards';
import GameDashboard from '../components/GameDashboard';
import QueueSystem from '../components/QueueSystem';
import { StaggerContainer, StaggerItem } from '../components/PageTransition';

const Dashboard = () => {
  return (
    <StaggerContainer className="bg-[#000717] p-8 rounded shadow-md max-w-7xl mx-auto mt-10 text-white" staggerDelay={0.1}>
      <StaggerItem>
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Painel de Controle</h1>
      </StaggerItem>
      
      <StaggerItem>
        <p className="text-sm text-center text-gray-400 mb-8">
          Dashboard em tempo real conectado ao backend
        </p>
      </StaggerItem>

      {/* Seção de Jogo */}
      <StaggerItem>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">🎮 Sistema de Jogos</h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <GameDashboard />
            </div>
            <div className="xl:col-span-1">
              <QueueSystem />
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Seção de Administração */}
      <StaggerItem>
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">📊 Estatísticas Administrativas</h2>
          <DashboardCards />
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default Dashboard;

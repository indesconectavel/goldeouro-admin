import React, { useEffect } from 'react';
import DashboardCardsResponsive from '../components/DashboardCardsResponsive';
import GameDashboard from '../components/GameDashboard';
import StandardPageLayout from '../components/StandardPageLayout';
import { startPerformanceMonitoring } from '../config/performance';

const Dashboard = () => {
  useEffect(() => {
    // Iniciar monitoramento de performance
    startPerformanceMonitoring();
  }, []);

  return (
    <StandardPageLayout
      title="⚽ Painel de Controle"
      description="Dashboard em tempo real conectado ao backend"
    >
      {/* Dashboard Cards */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Sistema de Jogos</h2>
        <DashboardCardsResponsive />
      </div>

      {/* Game Dashboard */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Métricas Detalhadas</h2>
        <GameDashboard />
      </div>
    </StandardPageLayout>
  );
};

export default Dashboard;

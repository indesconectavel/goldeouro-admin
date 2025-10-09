import React, { useEffect, useState } from 'react';
import DashboardCardsResponsive from '../components/DashboardCardsResponsive';
import GameDashboard from '../components/GameDashboard';
import StandardPageLayout from '../components/StandardPageLayout';
import { startPerformanceMonitoring } from '../config/performance';
import dataService from '../services/dataService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalGames: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    totalWithdrawals: 0,
    netBalance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Iniciar monitoramento de performance
    startPerformanceMonitoring();
    
    // Carregar dados reais
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      setLoading(true);
      const generalStats = await dataService.getGeneralStats();
      setStats(generalStats);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardPageLayout
      title="⚽ Painel de Controle"
      description="Dashboard em tempo real conectado ao backend"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Carregando dados reais...</div>
        </div>
      ) : (
        <>
          {/* Dashboard Cards */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Sistema de Jogos</h2>
            <DashboardCardsResponsive stats={stats} />
          </div>

          {/* Game Dashboard */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Métricas Detalhadas</h2>
            <GameDashboard stats={stats} />
          </div>
        </>
      )}
    </StandardPageLayout>
  );
};

export default Dashboard;

// src/pages/EstatisticasGeraisResponsive.jsx

import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import Loader from '../components/Loader';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export default function EstatisticasGeraisResponsive() {
  const { device, isMobile } = useDeviceDetection();
  const [estatisticas, setEstatisticas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await postData('/admin/estatisticas-gerais', {});
        setEstatisticas(result);
      } catch (error) {
        console.error('Erro ao carregar estatísticas gerais:', error);
        setError('Não foi possível carregar as estatísticas. Tente novamente mais tarde.');
        setEstatisticas(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Dados fictícios como fallback
  const fallbackEstatisticas = {
    total_users: 1250,
    total_games: 5670,
    total_transactions: 12340,
    total_credited: 45670.50,
    total_paid: 23450.75,
    profit: 22219.75,
    average_shots_per_user: 4.5
  };

  // Cards de estatísticas
  const statsCards = [
    {
      title: 'Total de Usuários',
      value: estatisticas?.total_users || fallbackEstatisticas.total_users,
      icon: '👥',
      color: 'text-blue-400'
    },
    {
      title: 'Total de Jogos',
      value: estatisticas?.total_games || fallbackEstatisticas.total_games,
      icon: '🎮',
      color: 'text-green-400'
    },
    {
      title: 'Total de Transações',
      value: estatisticas?.total_transactions || fallbackEstatisticas.total_transactions,
      icon: '💳',
      color: 'text-purple-400'
    },
    {
      title: 'Total Creditado',
      value: `R$ ${(estatisticas?.total_credited || fallbackEstatisticas.total_credited).toFixed(2)}`,
      icon: '💰',
      color: 'text-green-400'
    },
    {
      title: 'Total Pago',
      value: `R$ ${(estatisticas?.total_paid || fallbackEstatisticas.total_paid).toFixed(2)}`,
      icon: '💸',
      color: 'text-red-400'
    },
    {
      title: 'Lucro/Prejuízo',
      value: `R$ ${(estatisticas?.profit || fallbackEstatisticas.profit).toFixed(2)}`,
      icon: '📈',
      color: 'text-yellow-400'
    },
    {
      title: 'Média de Chutes por Usuário',
      value: estatisticas?.average_shots_per_user || fallbackEstatisticas.average_shots_per_user,
      icon: '⚽',
      color: 'text-orange-400'
    }
  ];

  if (loading) {
    return (
      <StandardPageLayout
        title="📊 Estatísticas Gerais"
        description="Carregando estatísticas..."
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </StandardPageLayout>
    );
  }

  if (error) {
    return (
      <StandardPageLayout
        title="📊 Estatísticas Gerais"
        description="Erro ao carregar dados"
      >
        <SectionCard title="❌ Erro">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </SectionCard>
      </StandardPageLayout>
    );
  }

  return (
    <div className="bg-[#000717] text-white min-h-screen p-4 md:p-6">
      <div className="bg-[#111827] p-4 md:p-8 rounded shadow-md max-w-4xl mx-auto mt-10">
        <PageTitle>Estatísticas Gerais</PageTitle>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'} text-sm sm:text-base`}>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total de Usuários</p>
            <h2 className="text-xl font-bold text-white">{estatisticas.total_users}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total de Jogos</p>
            <h2 className="text-xl font-bold text-blue-400">{estatisticas.total_games}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total de Transações</p>
            <h2 className="text-xl font-bold text-green-400">{estatisticas.total_transactions}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total Creditado</p>
            <h2 className="text-xl font-bold text-green-400">R$ {estatisticas.total_credited.toFixed(2)}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total Pago</p>
            <h2 className="text-xl font-bold text-red-400">R$ {estatisticas.total_paid.toFixed(2)}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Lucro/Prejuízo</p>
            <h2 className="text-xl font-bold text-green-400">R$ {estatisticas.profit.toFixed(2)}</h2>
          </div>
          <div className={`bg-[#1f2937] p-4 rounded-lg shadow text-center ${isMobile ? 'col-span-1' : 'sm:col-span-2 lg:col-span-3'}`}>
            <p className="text-gray-300">Média de Chutes por Usuário</p>
            <h2 className="text-xl font-bold text-yellow-400">{estatisticas.average_shots_per_user}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

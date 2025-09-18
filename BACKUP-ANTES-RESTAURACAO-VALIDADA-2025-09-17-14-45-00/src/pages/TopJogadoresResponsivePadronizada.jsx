// src/pages/TopJogadoresResponsivePadronizada.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import ResponsiveWrapper from "../components/ResponsiveWrapper";
import StandardPageLayout from "../components/StandardPageLayout";
import ResponsiveCard, { SectionCard } from "../components/ResponsiveCard";
import ResponsiveGrid from "../components/ResponsiveGrid";
import ResponsiveTable, { StatusBadge, CurrencyValue } from "../components/ResponsiveTable";
import TopJogadores from "./TopJogadores";

const TopJogadoresResponsivePadronizada = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <TopJogadores />;
  }

  // Mobile e Tablet usam versão responsiva padronizada
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_TOP_JOGADORES"
      fallback={<TopJogadores />}
      desktopFallback={<TopJogadores />}
    >
      <TopJogadoresMobileTabletPadronizada />
    </ResponsiveWrapper>
  );
};

const TopJogadoresMobileTabletPadronizada = () => {
  const { device, isMobile } = useDeviceDetection();
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJogadores();
  }, []);

  const fetchJogadores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/admin/top-jogadores', {});
      setJogadores(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      // Dados de fallback para demonstração
      setJogadores([
        {
          id: 1,
          name: 'João Silva',
          games: 25,
          wins: 18,
          goals: 45,
          efficiency: 72
        },
        {
          id: 2,
          name: 'Maria Santos',
          games: 22,
          wins: 16,
          goals: 38,
          efficiency: 73
        },
        {
          id: 3,
          name: 'Pedro Costa',
          games: 20,
          wins: 14,
          goals: 32,
          efficiency: 70
        },
        {
          id: 4,
          name: 'Ana Oliveira',
          games: 18,
          wins: 12,
          goals: 28,
          efficiency: 67
        },
        {
          id: 5,
          name: 'Carlos Lima',
          games: 16,
          wins: 10,
          goals: 24,
          efficiency: 63
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'position',
      label: 'Posição',
      render: (value, jogador, index) => (
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            index === 0 ? 'bg-yellow-400 text-black' : 
            index === 1 ? 'bg-gray-300 text-black' : 
            index === 2 ? 'bg-orange-400 text-black' : 
            'bg-gray-600 text-white'
          }`}>
            #{index + 1}
          </div>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Nome',
      render: (value, jogador) => (
        <div className="font-medium text-white">{jogador.name}</div>
      )
    },
    {
      key: 'games',
      label: 'Jogos',
      render: (value, jogador) => (
        <div className="text-gray-300">{jogador.games}</div>
      )
    },
    {
      key: 'wins',
      label: 'Vitórias',
      render: (value, jogador) => (
        <div className="text-green-400 font-semibold">{jogador.wins}</div>
      )
    },
    {
      key: 'goals',
      label: 'Gols',
      render: (value, jogador) => (
        <div className="text-yellow-400 font-semibold">{jogador.goals}</div>
      )
    },
    {
      key: 'efficiency',
      label: 'Taxa de Vitória',
      render: (value, jogador) => (
        <div className="text-blue-400 font-semibold">{jogador.efficiency}%</div>
      )
    }
  ];

  // Estatísticas para cards
  const stats = [
    {
      title: 'Total de Jogadores',
      value: jogadores.length,
      icon: '👥',
      color: 'text-blue-400'
    },
    {
      title: 'Jogos Totais',
      value: jogadores.reduce((acc, j) => acc + j.games, 0),
      icon: '⚽',
      color: 'text-green-400'
    },
    {
      title: 'Gols Totais',
      value: jogadores.reduce((acc, j) => acc + j.goals, 0),
      icon: '🥅',
      color: 'text-yellow-400'
    },
    {
      title: 'Taxa Média',
      value: `${Math.round(jogadores.reduce((acc, j) => acc + j.efficiency, 0) / jogadores.length || 0)}%`,
      icon: '📊',
      color: 'text-blue-400'
    }
  ];

  if (loading) {
    return (
      <StandardPageLayout
        title="🏆 Top Jogadores"
        description="Carregando ranking dos jogadores..."
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
        title="🏆 Top Jogadores"
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
    <StandardPageLayout
      title="🏆 Top Jogadores"
      description="Ranking dos jogadores com melhor desempenho no Gol de Ouro"
    >
      {/* Cards de Estatísticas */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estatísticas</h2>
        <ResponsiveGrid columns="auto" gap="default">
          {stats.map((stat, index) => (
            <ResponsiveCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              className={stat.color}
            />
          ))}
        </ResponsiveGrid>
      </div>

      {/* Ranking de Jogadores */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Ranking ({jogadores.length} jogadores)
        </h2>
        <SectionCard title="Jogadores">
          {jogadores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Ainda não há dados suficientes para o ranking</p>
            </div>
          ) : (
            <ResponsiveTable
              data={jogadores}
              columns={columns}
              mobileView="cards"
              emptyMessage="Nenhum jogador encontrado"
              onRowClick={(jogador, index) => console.log('Clicou em:', jogador, 'Posição:', index + 1)}
            />
          )}
        </SectionCard>
      </div>
    </StandardPageLayout>
  );
};

export default TopJogadoresResponsivePadronizada;

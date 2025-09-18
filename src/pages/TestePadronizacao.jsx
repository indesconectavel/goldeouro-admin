import React, { useState } from 'react';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { StatCard, SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid, { StatsGrid, MetricsGrid, SpecialGrid } from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue, NumberValue } from '../components/ResponsiveTable';
import { DESIGN_SYSTEM } from '../config/designSystem';

// Página de teste para demonstrar o novo sistema padronizado
const TestePadronizacao = () => {
  const [loading, setLoading] = useState(false);

  // Dados de exemplo
  const statsData = [
    { title: 'Usuários', value: '1,234', icon: '👥', trend: 12.5 },
    { title: 'Jogos', value: '567', icon: '🎮', trend: -2.3 },
    { title: 'Apostas', value: '8,901', icon: '💰', trend: 8.7 },
    { title: 'Na Fila', value: '23', icon: '⏳', trend: 0 },
  ];

  const metricsData = [
    { title: 'Total de Jogos', value: '1,234', icon: '🎮' },
    { title: 'Total de Jogadores', value: '567', icon: '👥' },
    { title: 'Prêmios Pagos', value: 'R$ 12.345', icon: '💰' },
    { title: 'Total de Chutes', value: '8,901', icon: '🏃🏽‍♂️' },
  ];

  const tableData = [
    { id: 1, name: 'João Silva', status: 'active', value: 1250.50, games: 25 },
    { id: 2, name: 'Maria Santos', status: 'waiting', value: 890.75, games: 18 },
    { id: 3, name: 'Pedro Costa', status: 'finished', value: 2100.00, games: 32 },
  ];

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    { 
      key: 'value', 
      label: 'Valor',
      render: (value) => <CurrencyValue value={value} />
    },
    { 
      key: 'games', 
      label: 'Jogos',
      render: (value) => <NumberValue value={value} />
    },
  ];

  return (
    <StandardPageLayout
      title="🧪 Teste de Padronização"
      description="Demonstração do novo sistema de design unificado"
    >
      {/* Cards de Estatísticas */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Cards de Estatísticas</h2>
        <StatsGrid>
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </StatsGrid>
      </div>

      {/* Cards de Métricas */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Cards de Métricas</h2>
        <MetricsGrid>
          {metricsData.map((metric, index) => (
            <ResponsiveCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </MetricsGrid>
      </div>

      {/* Cards Especiais */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Cards Especiais</h2>
        <SpecialGrid>
          <SectionCard title="🏆 Gol de Ouro">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Gols de Ouro:</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Próximo em:</span>
                <span className="text-white font-bold">5 chutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Prêmio:</span>
                <CurrencyValue value={50} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="📊 Estatísticas Rápidas">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Taxa de Sucesso:</span>
                <span className="text-green-400 font-bold">98.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Tempo Médio:</span>
                <span className="text-white font-bold">45 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Jogos Hoje:</span>
                <NumberValue value={1200} />
              </div>
            </div>
          </SectionCard>
        </SpecialGrid>
      </div>

      {/* Tabela Responsiva */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Tabela Responsiva</h2>
        <SectionCard title="Jogadores Recentes">
          <ResponsiveTable
            columns={tableColumns}
            data={tableData}
            mobileView="cards"
            emptyMessage="Nenhum jogador encontrado"
            onRowClick={(row) => console.log('Clicou em:', row)}
          />
        </SectionCard>
      </div>

      {/* Teste de Estados */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estados e Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <StatusBadge status="active" />
            <p className="text-sm text-gray-400 mt-2">Ativo</p>
          </div>
          <div className="text-center">
            <StatusBadge status="waiting" />
            <p className="text-sm text-gray-400 mt-2">Aguardando</p>
          </div>
          <div className="text-center">
            <StatusBadge status="finished" />
            <p className="text-sm text-gray-400 mt-2">Finalizado</p>
          </div>
          <div className="text-center">
            <StatusBadge status="error" />
            <p className="text-sm text-gray-400 mt-2">Erro</p>
          </div>
        </div>
      </div>

      {/* Teste de Loading */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estados de Loading</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-6">
            <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-center text-gray-400">Loading Spinner</p>
          </div>
          <div className="card p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
            <p className="text-center text-gray-400 mt-4">Skeleton Loading</p>
          </div>
          <div className="card p-6">
            <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-pulse"></div>
            <p className="text-center text-gray-400 mt-4">Shimmer Loading</p>
          </div>
        </div>
      </div>
    </StandardPageLayout>
  );
};

export default TestePadronizacao;

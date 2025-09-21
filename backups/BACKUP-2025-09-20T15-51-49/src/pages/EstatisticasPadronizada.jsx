import React, { useState, useEffect } from 'react';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { StatCard, SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid, { StatsGrid, MetricsGrid } from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue, NumberValue } from '../components/ResponsiveTable';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

// Página de Estatísticas padronizada com Design System
const EstatisticasPadronizada = () => {
  const { device } = useDeviceDetection();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Dados de exemplo para demonstração
  const mockData = {
    stats: [
      { title: 'Total de Jogos', value: '1,234', icon: '🎮', trend: 12.5 },
      { title: 'Jogadores Ativos', value: '567', icon: '👥', trend: 8.7 },
      { title: 'Apostas Hoje', value: '89', icon: '💰', trend: -2.3 },
      { title: 'Prêmios Pagos', value: '578', icon: '🏆', trend: 15.2 }
    ],
    metrics: [
      { title: 'Taxa de Sucesso', value: '98.5%', icon: '📈' },
      { title: 'Tempo Médio', value: '45 min', icon: '⏱️' },
      { title: 'Receita Total', value: 'R$ 12.345', icon: '💵' },
      { title: 'Lucro Líquido', value: 'R$ 8.901', icon: '💎' }
    ],
    tableData: [
      { id: 1, name: 'João Silva', status: 'active', value: 1250.50, games: 25 },
      { id: 2, name: 'Maria Santos', status: 'waiting', value: 890.75, games: 18 },
      { id: 3, name: 'Pedro Costa', status: 'finished', value: 2100.00, games: 32 },
      { id: 4, name: 'Ana Oliveira', status: 'active', value: 1567.25, games: 28 }
    ]
  };

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
    }
  ];

  return (
    <StandardPageLayout
      title="📊 Estatísticas"
      description="Estatísticas detalhadas do sistema de jogos"
    >
      {/* Cards de Estatísticas Principais */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estatísticas Principais</h2>
        <StatsGrid>
          {mockData.stats.map((stat, index) => (
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
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Métricas de Performance</h2>
        <MetricsGrid>
          {mockData.metrics.map((metric, index) => (
            <ResponsiveCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </MetricsGrid>
      </div>

      {/* Tabela de Jogadores */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Top Jogadores</h2>
        <SectionCard title="Ranking de Jogadores">
          <ResponsiveTable
            columns={tableColumns}
            data={mockData.tableData}
            mobileView="cards"
            emptyMessage="Nenhum jogador encontrado"
            onRowClick={(row) => console.log('Clicou em:', row)}
          />
        </SectionCard>
      </div>

      {/* Cards Especiais */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Informações Adicionais</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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

          <SectionCard title="📈 Resumo Semanal">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Jogos Esta Semana:</span>
                <NumberValue value={156} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Crescimento:</span>
                <span className="text-green-400 font-bold">+23.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Meta Semanal:</span>
                <span className="text-white font-bold">200 jogos</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Estados de Status */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Status do Sistema</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <StatusBadge status="active" />
            <p className="text-sm text-gray-400 mt-2">Sistema Ativo</p>
          </div>
          <div className="text-center">
            <StatusBadge status="success" />
            <p className="text-sm text-gray-400 mt-2">Backend OK</p>
          </div>
          <div className="text-center">
            <StatusBadge status="info" />
            <p className="text-sm text-gray-400 mt-2">WebSocket</p>
          </div>
          <div className="text-center">
            <StatusBadge status="warning" />
            <p className="text-sm text-gray-400 mt-2">Manutenção</p>
          </div>
        </div>
      </div>
    </StandardPageLayout>
  );
};

export default EstatisticasPadronizada;

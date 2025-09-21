import React, { useState, useEffect } from 'react';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { StatCard, SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid, { StatsGrid, MetricsGrid } from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue, NumberValue } from '../components/ResponsiveTable';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

// Página de Transações padronizada com Design System
const TransacoesPadronizada = () => {
  const { device } = useDeviceDetection();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Dados de exemplo para demonstração
  const mockData = {
    stats: [
      { title: 'Total de Transações', value: '1,234', icon: '💳', trend: 12.5 },
      { title: 'Transações Hoje', value: '89', icon: '📅', trend: 8.7 },
      { title: 'Valor Total', value: 'R$ 45.678', icon: '💰', trend: 15.2 },
      { title: 'Taxa de Sucesso', value: '98.5%', icon: '✅', trend: 2.3 }
    ],
    metrics: [
      { title: 'Depósitos', value: 'R$ 25.000', icon: '⬆️' },
      { title: 'Saques', value: 'R$ 15.000', icon: '⬇️' },
      { title: 'Taxa de Processamento', value: '2.5%', icon: '📊' },
      { title: 'Tempo Médio', value: '2 min', icon: '⏱️' }
    ],
    tableData: [
      { id: 1, tipo: 'Depósito', valor: 500.00, status: 'completed', data: '2025-01-07T10:00:00Z', usuario: 'João Silva' },
      { id: 2, tipo: 'Saque', valor: 200.00, status: 'pending', data: '2025-01-07T11:30:00Z', usuario: 'Maria Santos' },
      { id: 3, tipo: 'Depósito', valor: 1000.00, status: 'completed', data: '2025-01-07T12:15:00Z', usuario: 'Pedro Costa' },
      { id: 4, tipo: 'Saque', valor: 150.00, status: 'failed', data: '2025-01-07T13:45:00Z', usuario: 'Ana Oliveira' }
    ]
  };

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'valor', label: 'Valor', render: (value) => <CurrencyValue value={value} /> },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'usuario', label: 'Usuário' },
    { 
      key: 'data', 
      label: 'Data',
      render: (value) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  return (
    <StandardPageLayout
      title="💳 Transações"
      description="Gerencie todas as transações financeiras do sistema"
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

      {/* Tabela de Transações */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Histórico de Transações</h2>
        <SectionCard title="Lista de Transações">
          <ResponsiveTable
            columns={tableColumns}
            data={mockData.tableData}
            mobileView="cards"
            emptyMessage="Nenhuma transação encontrada"
            onRowClick={(row) => console.log('Clicou em:', row)}
          />
        </SectionCard>
      </div>

      {/* Cards Especiais */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Informações Adicionais</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="📊 Resumo Financeiro">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Receita Total:</span>
                <CurrencyValue value={25000} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Despesas:</span>
                <CurrencyValue value={15000} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Lucro Líquido:</span>
                <span className="text-green-400 font-bold">R$ 10.000,00</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="⚙️ Status do Sistema">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Gateway de Pagamento:</span>
                <StatusBadge status="active" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Processamento:</span>
                <StatusBadge status="success" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Última Sincronização:</span>
                <span className="text-white font-bold">Hoje 14:30</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Estados de Status */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Status das Transações</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <StatusBadge status="completed" />
            <p className="text-sm text-gray-400 mt-2">Concluída</p>
          </div>
          <div className="text-center">
            <StatusBadge status="pending" />
            <p className="text-sm text-gray-400 mt-2">Pendente</p>
          </div>
          <div className="text-center">
            <StatusBadge status="failed" />
            <p className="text-sm text-gray-400 mt-2">Falhou</p>
          </div>
          <div className="text-center">
            <StatusBadge status="processing" />
            <p className="text-sm text-gray-400 mt-2">Processando</p>
          </div>
        </div>
      </div>
    </StandardPageLayout>
  );
};

export default TransacoesPadronizada;

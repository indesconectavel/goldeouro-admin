import React, { useEffect, useState } from 'react';
import StandardPageLayout from '../components/StandardPageLayout';
import { startPerformanceMonitoring } from '../config/performance';
import { getData } from '../js/api';
import GridTemplate from '../templates/GridTemplate';
import CardTemplate from '../templates/CardTemplate';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Iniciar monitoramento de performance
    startPerformanceMonitoring();
    
    // Carregar dados reais
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getData('/api/admin/dashboard/stats');
      if (!response?.success || !response?.data) {
        throw new Error(response?.message || 'Falha ao carregar métricas do dashboard');
      }
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setError(error?.message || 'Erro ao carregar dashboard');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));

  return (
    <StandardPageLayout
      title="⚽ Painel de Controle"
      description="Dashboard em tempo real conectado ao backend"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Carregando dados reais...</div>
        </div>
      ) : error ? (
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-300">
          {error}
        </div>
      ) : !stats ? (
        <div className="p-4 rounded bg-white/10 border border-white/20 text-gray-300">
          Nenhum dado disponível para o dashboard.
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Métricas Operacionais</h2>
          <GridTemplate cols={{ sm: 2, lg: 3 }}>
            <CardTemplate title="Total de Usuários" value={stats.total_users ?? 0} color="yellow" />
            <CardTemplate title="Saldo Total" value={formatCurrency(stats.saldo_total)} color="green" />
            <CardTemplate title="Saques Pendentes" value={stats.saques_pendentes ?? 0} color="red" />
            <CardTemplate title="Total de Saques" value={stats.saques_total ?? 0} color="blue" />
            <CardTemplate title="Transações Ledger" value={stats.ledger_transacoes_total ?? 0} color="yellow" />
            <CardTemplate
              title="Volume Financeiro"
              value={formatCurrency(stats.volume_financeiro_total)}
              color="green"
            />
          </GridTemplate>
          <div className="text-sm text-gray-400">
            Atualizado em:{' '}
            {stats.updated_at ? new Date(stats.updated_at).toLocaleString('pt-BR') : '-'}
          </div>
        </div>
      )}
    </StandardPageLayout>
  );
};

export default Dashboard;

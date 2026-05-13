// src/pages/Estatisticas.jsx

import React, { useEffect, useState } from 'react';
import { getData } from '../js/api';

const Estatisticas = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getData('/api/admin/dashboard/stats');
        if (!response?.success || !response?.data) {
          throw new Error(response?.message || 'Falha ao carregar estatísticas');
        }
        setStats(response.data);
      } catch (e) {
        console.error('Erro ao buscar estatísticas:', e);
        setStats(null);
        setError(e?.message || 'Não foi possível carregar as estatísticas.');
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="card p-6 max-w-6xl mx-auto">
          <div className="text-center text-yellow-400">Carregando estatísticas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-yellow-400">Estatísticas</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
        <p className="text-gray-400 text-sm">
          Fonte: <code className="text-yellow-200/90">GET /api/admin/dashboard/stats</code>
        </p>
      </div>
    );
  }

  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Estatísticas</h1>
      <p className="text-gray-400 text-sm mb-6">
        Visão alinhada ao dashboard administrativo (métricas reais). Não inclui &quot;total de jogos&quot; ou ranking
        de jogadores — endpoints dedicados não existem na API atual.
      </p>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center border border-yellow-500/20">
            <h3 className="text-sm font-medium text-yellow-300 mb-2">Total de usuários</h3>
            <p className="text-2xl font-bold text-white">{stats.total_users ?? 0}</p>
          </div>
          <div className="card p-6 text-center border border-green-500/20">
            <h3 className="text-sm font-medium text-green-300 mb-2">Saldo agregado</h3>
            <p className="text-2xl font-bold text-green-400">{fmt(stats.saldo_total)}</p>
          </div>
          <div className="card p-6 text-center border border-red-500/20">
            <h3 className="text-sm font-medium text-red-300 mb-2">Saques pendentes</h3>
            <p className="text-2xl font-bold text-red-400">{stats.saques_pendentes ?? 0}</p>
          </div>
          <div className="card p-6 text-center border border-blue-500/20">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Total de saques</h3>
            <p className="text-2xl font-bold text-blue-300">{stats.saques_total ?? 0}</p>
          </div>
          <div className="card p-6 text-center border border-yellow-500/20">
            <h3 className="text-sm font-medium text-yellow-300 mb-2">Linhas no ledger</h3>
            <p className="text-2xl font-bold text-white">{stats.ledger_transacoes_total ?? 0}</p>
          </div>
          <div className="card p-6 text-center border border-green-500/20">
            <h3 className="text-sm font-medium text-green-300 mb-2">Volume financeiro (ledger)</h3>
            <p className="text-2xl font-bold text-green-400">{fmt(stats.volume_financeiro_total)}</p>
          </div>
        </div>
      )}

      {stats?.updated_at ? (
        <p className="text-xs text-gray-500">Atualizado em: {new Date(stats.updated_at).toLocaleString('pt-BR')}</p>
      ) : null}
    </div>
  );
};

export default Estatisticas;

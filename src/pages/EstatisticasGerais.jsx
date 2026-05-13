// src/pages/EstatisticasGerais.jsx

import { useEffect, useState } from 'react';
import { getData } from '../js/api';
import Loader from '../components/Loader';

export default function EstatisticasGerais() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setError('');
      try {
        const result = await getData('/api/admin/dashboard/stats');
        if (!result?.success || !result?.data) {
          throw new Error(result?.message || 'Falha ao carregar');
        }
        const d = result.data;
        setEstatisticas({
          totalUsuarios: d.total_users ?? 0,
          usuariosAtivos: null,
          usuariosBloqueados: null,
          totalPartidas: null,
          mediaGolsPorPartida: null
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas gerais:', error);
        setEstatisticas(null);
        setError(error?.message || 'Erro ao carregar estatísticas.');
      }
    }
    void fetchData();
  }, []);

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold text-yellow-400">Estatísticas gerais</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
      </div>
    );
  }

  if (!estatisticas) return <Loader />;

  const { totalUsuarios, usuariosAtivos, usuariosBloqueados, totalPartidas, mediaGolsPorPartida } = estatisticas;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Estatísticas gerais</h1>
      <p className="text-gray-400 text-sm mb-4">
        Parcial: apenas total de usuários via <code className="text-yellow-200/90">GET /api/admin/dashboard/stats</code>.
        Demais campos não têm endpoint consolidado nesta API.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
        <div className="card p-4 text-center">
          <p className="text-gray-300">Total de Usuários</p>
          <h2 className="text-xl font-bold text-white">{totalUsuarios}</h2>
        </div>
        <div className="card p-4 text-center">
          <p className="text-gray-300">Usuários Ativos</p>
          <h2 className="text-xl font-bold text-gray-500">{usuariosAtivos != null ? usuariosAtivos : '—'}</h2>
        </div>
        <div className="card p-4 text-center">
          <p className="text-gray-300">Usuários Bloqueados</p>
          <h2 className="text-xl font-bold text-gray-500">{usuariosBloqueados != null ? usuariosBloqueados : '—'}</h2>
        </div>
        <div className="card p-4 text-center">
          <p className="text-gray-300">Partidas Finalizadas</p>
          <h2 className="text-xl font-bold text-gray-500">{totalPartidas != null ? totalPartidas : '—'}</h2>
        </div>
        <div className="card p-4 text-center sm:col-span-2">
          <p className="text-gray-300">Média de Gols por Partida</p>
          <h2 className="text-xl font-bold text-gray-500">
            {mediaGolsPorPartida != null ? mediaGolsPorPartida : '—'}
          </h2>
        </div>
      </div>
    </div>
  );
}

// src/pages/EstatisticasGerais.jsx

import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import Loader from '../components/Loader';

export default function EstatisticasGerais() {
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
    total_users: 50,
    total_games: 100,
    total_transactions: 150,
    total_credited: 1000.00,
    total_paid: 500.00,
    profit: 250.00,
    average_shots_per_user: 2.0
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-6 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">Estatísticas Gerais</h1>
          <div className="mb-4 p-4 bg-yellow-900 text-yellow-200 rounded">
            <p className="text-sm">⚠️ Usando dados fictícios para demonstração</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total de Usuários</p>
              <h2 className="text-xl font-bold text-white">{fallbackEstatisticas.total_users}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total de Jogos</p>
              <h2 className="text-xl font-bold text-blue-400">{fallbackEstatisticas.total_games}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total de Transações</p>
              <h2 className="text-xl font-bold text-green-400">{fallbackEstatisticas.total_transactions}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total Creditado</p>
              <h2 className="text-xl font-bold text-green-400">R$ {fallbackEstatisticas.total_credited.toFixed(2)}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total Pago</p>
              <h2 className="text-xl font-bold text-red-400">R$ {fallbackEstatisticas.total_paid.toFixed(2)}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Lucro/Prejuízo</p>
              <h2 className="text-xl font-bold text-green-400">R$ {fallbackEstatisticas.profit.toFixed(2)}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center sm:col-span-2 lg:col-span-3">
              <p className="text-gray-300">Média de Chutes por Usuário</p>
              <h2 className="text-xl font-bold text-yellow-400">{fallbackEstatisticas.average_shots_per_user}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!estatisticas) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-6 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">Estatísticas Gerais</h1>
          <div className="mb-4 p-4 bg-yellow-900 text-yellow-200 rounded">
            <p className="text-sm">⚠️ Usando dados fictícios para demonstração</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total de Usuários</p>
              <h2 className="text-xl font-bold text-white">{fallbackEstatisticas.total_users}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total de Jogos</p>
              <h2 className="text-xl font-bold text-blue-400">{fallbackEstatisticas.total_games}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total de Transações</p>
              <h2 className="text-xl font-bold text-green-400">{fallbackEstatisticas.total_transactions}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total Creditado</p>
              <h2 className="text-xl font-bold text-green-400">R$ {fallbackEstatisticas.total_credited.toFixed(2)}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Total Pago</p>
              <h2 className="text-xl font-bold text-red-400">R$ {fallbackEstatisticas.total_paid.toFixed(2)}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
              <p className="text-gray-300">Lucro/Prejuízo</p>
              <h2 className="text-xl font-bold text-green-400">R$ {fallbackEstatisticas.profit.toFixed(2)}</h2>
            </div>
            <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center sm:col-span-2 lg:col-span-3">
              <p className="text-gray-300">Média de Chutes por Usuário</p>
              <h2 className="text-xl font-bold text-yellow-400">{fallbackEstatisticas.average_shots_per_user}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    total_users,
    total_games,
    total_transactions,
    total_credited,
    total_paid,
    profit,
    average_shots_per_user
  } = estatisticas;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-6 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Estatísticas Gerais</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total de Usuários</p>
            <h2 className="text-xl font-bold text-white">{total_users}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total de Jogos</p>
            <h2 className="text-xl font-bold text-blue-400">{total_games}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total de Transações</p>
            <h2 className="text-xl font-bold text-green-400">{total_transactions}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total Creditado</p>
            <h2 className="text-xl font-bold text-green-400">R$ {total_credited}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total Pago</p>
            <h2 className="text-xl font-bold text-red-400">R$ {total_paid}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Lucro/Prejuízo</p>
            <h2 className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              R$ {profit}
            </h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center sm:col-span-2 lg:col-span-3">
            <p className="text-gray-300">Média de Chutes por Usuário</p>
            <h2 className="text-xl font-bold text-yellow-400">{average_shots_per_user}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
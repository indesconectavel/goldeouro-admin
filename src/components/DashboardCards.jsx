import { useEffect, useState } from 'react';
import { getData } from '../js/api';
import LoadingSpinner from './LoadingSpinner';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockDashboardData } from '../data/mockData';

export default function DashboardCards() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  // Dados padrão baseados no ambiente
  const getDefaultData = () => {
    if (shouldUseMockData()) {
      return mockDashboardData;
    }
    return {
      users: 0,
      games: { 
        total: 0, 
        waiting: 0, 
        active: 0, 
        finished: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      },
      bets: 0,
      queue: 0,
      revenue: 0,
      profit: 0,
      averageBet: 0,
      successRate: 0,
      topPlayers: []
    };
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getData('/api/public/dashboard');
        if (alive) {
          setState({ loading: false, error: null, data });
        }
      } catch (e) {
        console.error('Erro ao buscar dados do dashboard:', e);
        if (alive) {
          // Usar dados padrão baseados no ambiente em caso de erro
          setState({ loading: false, error: String(e), data: getDefaultData() });
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  if (state.loading) return (
    <div className="text-center py-8">
      <LoadingSpinner size="lg" text="Carregando dados do dashboard..." />
    </div>
  );

  const displayData = state.error ? getDefaultData() : state.data;

  const { users, games, bets, queue } = displayData || {};
  
  return (
    <div className="space-y-6 w-full">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="card p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-semibold text-yellow-400 mb-2">Usuários</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{users ?? 0}</p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-semibold text-yellow-400 mb-2">Jogos</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{games?.total ?? 0}</p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-semibold text-yellow-400 mb-2">Apostas</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{bets ?? 0}</p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-semibold text-yellow-400 mb-2">Na Fila</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{queue ?? 0}</p>
        </div>
      </div>

      {/* Tabela de jogos recentes */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400">Jogos Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Criado em</th>
              </tr>
            </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
              {games && games.total > 0 ? (
                <>
                  <tr className="hover:bg-gray-700">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                      Jogo #{games.total - 2}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                        Finalizado
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                      Jogo #{games.total - 1}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                        Ativo
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(Date.now() - 30 * 60 * 1000).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                      Jogo #{games.total}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                        Aguardando
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date().toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="3" className="px-3 md:px-6 py-4 text-center text-gray-400">
                    Nenhum jogo encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

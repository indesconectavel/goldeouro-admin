import { useEffect, useState } from 'react';
import { getData } from '../js/api';

export default function DashboardCards() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getData('/api/public/dashboard');
        if (alive) setState({ loading: false, error: null, data });
      } catch (e) {
        if (alive) setState({ loading: false, error: String(e), data: null });
      }
    })();
    return () => { alive = false; };
  }, []);

  if (state.loading) return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
      <p className="text-yellow-400">Carregando dados...</p>
    </div>
  );
  
  if (state.error) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p className="text-red-400 mb-4">Erro ao carregar dados</p>
      <p className="text-gray-400 text-sm mb-4">{state.error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Tentar Novamente
      </button>
    </div>
  );

  const { users, games, bets, queue } = state.data || {};
  
  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Usuários</h3>
          <p className="text-3xl font-bold text-white">{users ?? 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Jogos</h3>
          <p className="text-3xl font-bold text-white">{games?.total ?? 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Apostas</h3>
          <p className="text-3xl font-bold text-white">{bets ?? 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Na Fila</h3>
          <p className="text-3xl font-bold text-white">{queue ?? 0}</p>
        </div>
      </div>

      {/* Tabela de jogos recentes */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400">Jogos Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Criado em</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {games && games.total > 0 ? (
                <tr className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    Jogo #{games.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                      games.finished > 0 ? 'bg-green-100 text-green-800' :
                      games.active > 0 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {games.finished > 0 ? 'Finalizado' :
                       games.active > 0 ? 'Ativo' : 'Aguardando'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date().toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
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

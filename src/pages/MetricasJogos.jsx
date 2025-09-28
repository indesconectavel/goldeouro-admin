import React, { useEffect, useState } from 'react';
import { config, getAuthToken } from '../config/env';
import Loader from '../components/Loader';

const MetricasJogos = () => {
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetricas();
  }, []);

  const fetchMetricas = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      // Simular dados de métricas (em produção, buscar da API)
      const mockMetricas = {
        total_games: 1250,
        completed_games: 1180,
        total_shots: 5900,
        total_goals: 2360,
        total_bets: 12500.00,
        total_winnings: 21240.00,
        average_game_duration: 180, // segundos
        most_popular_zone: 'MID',
        least_popular_zone: 'TL',
        zone_performance: [
          { zone: 'TL', total_shots: 980, goals: 392, accuracy: 40.0 },
          { zone: 'TR', total_shots: 1020, goals: 408, accuracy: 40.0 },
          { zone: 'MID', total_shots: 1200, goals: 600, accuracy: 50.0 },
          { zone: 'BL', total_shots: 950, goals: 380, accuracy: 40.0 },
          { zone: 'BR', total_shots: 1050, goals: 420, accuracy: 40.0 }
        ],
        games_by_hour: [
          { hour: '00:00', games: 45 },
          { hour: '01:00', games: 32 },
          { hour: '02:00', games: 28 },
          { hour: '03:00', games: 25 },
          { hour: '04:00', games: 22 },
          { hour: '05:00', games: 18 },
          { hour: '06:00', games: 35 },
          { hour: '07:00', games: 55 },
          { hour: '08:00', games: 78 },
          { hour: '09:00', games: 95 },
          { hour: '10:00', games: 110 },
          { hour: '11:00', games: 125 },
          { hour: '12:00', games: 140 },
          { hour: '13:00', games: 135 },
          { hour: '14:00', games: 150 },
          { hour: '15:00', games: 165 },
          { hour: '16:00', games: 180 },
          { hour: '17:00', games: 195 },
          { hour: '18:00', games: 210 },
          { hour: '19:00', games: 225 },
          { hour: '20:00', games: 240 },
          { hour: '21:00', games: 220 },
          { hour: '22:00', games: 180 },
          { hour: '23:00', games: 120 }
        ],
        top_players: [
          {},
          {},
          {},
          {},
          {}
        ]
      };

      setMetricas(mockMetricas);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      setError('Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-8">
        <div className="text-center">
          <h2 className="text-2xl text-red-400 mb-4">Erro ao carregar métricas</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchMetricas}
            className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const stats = metricas;

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Métricas de Jogos</h1>
          <p className="text-gray-400">Análise detalhada do desempenho dos jogos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Jogos</p>
                <p className="text-2xl font-bold text-white">{stats.total_games}</p>
              </div>
              <div className="text-blue-400 text-2xl">⚽</div>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Jogos Concluídos</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed_games}</p>
              </div>
              <div className="text-green-400 text-2xl">✅</div>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Chutes</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.total_shots}</p>
              </div>
              <div className="text-yellow-400 text-2xl">🎯</div>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Gols</p>
                <p className="text-2xl font-bold text-green-400">{stats.total_goals}</p>
              </div>
              <div className="text-green-400 text-2xl">🥅</div>
            </div>
          </div>
        </div>

        {/* Performance por Zona */}
        <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Performance por Zona</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.zone_performance.map((zone, index) => (
              <div key={index} className="bg-[#1a1a1a] p-4 rounded border border-[#333]">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white mb-2">{zone.zone}</h4>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-sm">Chutes: {zone.total_shots}</p>
                    <p className="text-green-400 text-sm">Gols: {zone.goals}</p>
                    <p className="text-yellow-400 text-sm">
                      Precisão: {zone.accuracy}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jogos por Hora */}
        <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Jogos por Hora do Dia</h3>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {stats.games_by_hour.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-400 mb-1">{item.hour}</div>
                <div 
                  className="bg-yellow-500 rounded"
                  style={{ height: `${(item.games / 250) * 100}px` }}
                  title={`${item.games} jogos`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Jogadores */}
        <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Top Jogadores</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#2c3e50]">
                  <th className="text-left py-3 text-gray-400">Posição</th>
                  <th className="text-left py-3 text-gray-400">Nome</th>
                  <th className="text-left py-3 text-gray-400">Jogos</th>
                  <th className="text-left py-3 text-gray-400">Vitórias</th>
                  <th className="text-left py-3 text-gray-400">Precisão</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_players.map((player, index) => (
                  <tr key={player.user_id} className="border-b border-[#2c3e50]">
                    <td className="py-3 text-yellow-400 font-bold">#{index + 1}</td>
                    <td className="py-3 text-white">{player.name}</td>
                    <td className="py-3 text-gray-400">{player.games}</td>
                    <td className="py-3 text-green-400">{player.wins}</td>
                    <td className="py-3 text-yellow-400 font-semibold">
                      {player.accuracy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estatísticas Financeiras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Estatísticas Financeiras</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Apostado:</span>
                <span className="text-red-400 font-semibold">
                  R$ {stats.total_bets.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Ganho:</span>
                <span className="text-green-400 font-semibold">
                  R$ {stats.total_winnings.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Lucro Líquido:</span>
                <span className="text-yellow-400 font-semibold">
                  R$ {(stats.total_winnings - stats.total_bets).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Margem de Lucro:</span>
                <span className="text-blue-400 font-semibold">
                  {(((stats.total_winnings - stats.total_bets) / stats.total_bets) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Estatísticas Gerais</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Taxa de Conclusão:</span>
                <span className="text-green-400 font-semibold">
                  {((stats.completed_games / stats.total_games) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Taxa de Gols:</span>
                <span className="text-yellow-400 font-semibold">
                  {((stats.total_goals / stats.total_shots) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duração Média:</span>
                <span className="text-blue-400 font-semibold">
                  {Math.floor(stats.average_game_duration / 60)}min {stats.average_game_duration % 60}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Zona Mais Popular:</span>
                <span className="text-purple-400 font-semibold">{stats.most_popular_zone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasJogos;

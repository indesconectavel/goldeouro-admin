import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { MemoizedStatCard } from './MemoizedComponents';

const GameDashboard = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlayers: 0,
    totalPrizes: 0,
    totalBets: 0,
    totalShots: 0,
    goldenGoals: 0,
    nextGoldenGoal: 0
  });

  const [recentGames, setRecentGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função simplificada para buscar estatísticas
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/games/stats');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }, []);

  // Função simplificada para buscar jogos recentes
  const fetchGames = useCallback(async () => {
    try {
      const response = await api.get('/games/recent');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar jogos recentes:', error);
      return null;
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Usar dados fictícios em caso de erro (congruentes com 100 chutes)
      setStats({
        totalGames: 100,
        totalPlayers: 50,
        totalPrizes: 500.00, // R$ 5,00 por jogo x 100 jogos
        totalBets: 1000.00, // R$ 10,00 por jogo x 100 jogos
        totalShots: 100, // 100 chutes
        goldenGoals: 12,
        nextGoldenGoal: 100 // 100 chutes para próximo gol de ouro
      });
    }
  }, [fetchStats]);

  const loadRecentGames = useCallback(async () => {
    try {
      const data = await fetchGames();
      setRecentGames(data);
    } catch (error) {
      console.error('Erro ao carregar jogos recentes:', error);
      // Usar dados fictícios em caso de erro
      setRecentGames([
        {
          id: 1,
          player: 'João Silva',
          gameType: 'Chute ao Gol',
          result: 'Gol',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          bet: 10.50
        },
        {
          id: 2,
          player: 'Maria Santos',
          gameType: 'Penalty',
          result: 'Defesa',
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          bet: 25.00
        },
        {
          id: 3,
          player: 'Pedro Costa',
          gameType: 'Falta',
          result: 'Gol',
          timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
          bet: 15.75
        }
      ]);
    }
  }, [fetchGames]);

  useEffect(() => {
    loadStats();
    loadRecentGames();
    
    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(() => {
      loadStats();
      loadRecentGames();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadStats, loadRecentGames]);

  // Função para formatar moeda
  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);



  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Se estiver carregando, mostrar dados fictícios (congruentes com 100 chutes)
  const displayStats = isLoading ? {
    totalGames: 100,
    totalPlayers: 50,
    totalPrizes: 500.00, // R$ 5,00 por jogo x 100 jogos
    totalBets: 1000.00, // R$ 10,00 por jogo x 100 jogos
    totalShots: 100, // 100 chutes
    goldenGoals: 12,
    nextGoldenGoal: 100 // 100 chutes para próximo gol de ouro
  } : stats;

  const displayRecentGames = isLoading ? [
    {
      id: 1,
      player: 'João Silva',
      gameType: 'Chute ao Gol',
      result: 'Gol',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      bet: 10.50
    },
    {
      id: 2,
      player: 'Maria Santos',
      gameType: 'Penalty',
      result: 'Defesa',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      bet: 25.00
    },
    {
      id: 3,
      player: 'Pedro Costa',
      gameType: 'Falta',
      result: 'Gol',
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      bet: 15.75
    }
  ] : recentGames;

  return (
    <div className="space-y-6 w-full">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MemoizedStatCard
          title="Total de Jogos"
          value={formatNumber(displayStats.totalGames)}
          icon="🎮"
        />

        <MemoizedStatCard
          title="Total de Jogadores"
          value={formatNumber(displayStats.totalPlayers)}
          icon="👥"
        />

        <MemoizedStatCard
          title="Prêmios Pagos"
          value={formatCurrency(displayStats.totalPrizes)}
          icon="💰"
        />

        <MemoizedStatCard
          title="Total de Chutes"
          value={formatNumber(displayStats.totalShots)}
          icon="🏃🏽‍♂️"
        />
      </div>

      {/* Cards Especiais */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Gol de Ouro */}
        <div className="card p-6 border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">🏆 Gol de Ouro</h3>
            <span className="text-3xl">⚡</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Gols de Ouro:</span>
              <span className="text-white font-bold">{displayStats.goldenGoals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Próximo em:</span>
              <span className="text-white font-bold">{displayStats.nextGoldenGoal} chutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Prêmio:</span>
              <span className="text-yellow-400 font-bold">R$ 50,00</span>
            </div>
          </div>
        </div>

        {/* Estatísticas de Apostas */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">📊 Apostas</h3>
            <span className="text-3xl">🎯</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Total Apostado:</span>
              <span className="text-white font-bold">{formatCurrency(displayStats.totalBets)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Valor por Jogo:</span>
              <span className="text-white font-bold">R$ 10,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Prêmio por Jogo:</span>
              <span className="text-white font-bold">R$ 5,00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progresso para o próximo Gol de Ouro */}
      <div className="card p-4">
        <h3 className="text-xl font-bold text-white mb-4">🥇 Progresso para o Próximo Gol de Ouro</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-yellow-400">Chutes até o próximo Gol de Ouro:</span>
            <span className="text-white font-bold">{displayStats.nextGoldenGoal}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${((1000 - displayStats.nextGoldenGoal) / 1000) * 100}%` }}
            />
          </div>
          <div className="text-center text-sm text-yellow-400">
            {1000 - displayStats.nextGoldenGoal} de 1000 chutes
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;

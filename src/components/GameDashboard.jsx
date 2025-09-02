import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { MemoizedStatCard } from './MemoizedComponents';
import { useCache } from '../hooks/usePerformance';

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

  // Cache para estatísticas
  const { data: cachedStats, fetchData: fetchStats } = useCache(
    'game-stats',
    () => api.get('/games/stats').then(res => res.data.data),
    30000 // 30 segundos de cache
  );

  // Cache para jogos recentes
  const { data: cachedGames, fetchData: fetchGames } = useCache(
    'recent-games',
    () => api.get('/games/recent').then(res => res.data.data),
    30000 // 30 segundos de cache
  );

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, [fetchStats]);

  const loadRecentGames = useCallback(async () => {
    try {
      const data = await fetchGames();
      setRecentGames(data);
    } catch (error) {
      console.error('Erro ao carregar jogos recentes:', error);
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MemoizedStatCard
          title="Total de Jogos"
          value={formatNumber(stats.totalGames)}
          icon="🎮"
        />

        <MemoizedStatCard
          title="Total de Jogadores"
          value={formatNumber(stats.totalPlayers)}
          icon="👥"
        />

        <MemoizedStatCard
          title="Prêmios Pagos"
          value={formatCurrency(stats.totalPrizes)}
          icon="💰"
        />

        <MemoizedStatCard
          title="Total de Chutes"
          value={formatNumber(stats.totalShots)}
          icon="⚽"
        />
      </div>

      {/* Cards Especiais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gol de Ouro */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1A202C] rounded-lg p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">🏆 Gol de Ouro</h3>
            <span className="text-3xl">⚡</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Gols de Ouro:</span>
              <span className="text-white font-bold">{stats.goldenGoals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Próximo em:</span>
              <span className="text-white font-bold">{stats.nextGoldenGoal} chutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Prêmio:</span>
              <span className="text-yellow-400 font-bold">R$ 50,00</span>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas de Apostas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1A202C] rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">📊 Apostas</h3>
            <span className="text-3xl">🎯</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Total Apostado:</span>
              <span className="text-white font-bold">{formatCurrency(stats.totalBets)}</span>
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
        </motion.div>
      </div>

      {/* Progresso para o próximo Gol de Ouro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[#1A202C] rounded-lg p-4 border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">🥇 Progresso para o Próximo Gol de Ouro</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-yellow-400">Chutes até o próximo Gol de Ouro:</span>
            <span className="text-white font-bold">{stats.nextGoldenGoal}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((1000 - stats.nextGoldenGoal) / 1000) * 100}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
          <div className="text-center text-sm text-yellow-400">
            {1000 - stats.nextGoldenGoal} de 1000 chutes
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

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

  useEffect(() => {
    loadStats();
    loadRecentGames();
    
    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(() => {
      loadStats();
      loadRecentGames();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/games/estatisticas');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentGames = async () => {
    try {
      // TODO: Implementar endpoint para jogos recentes
      // const response = await api.get('/games/recent');
      // setRecentGames(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar jogos recentes:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A202C] rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Total de Jogos</p>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.totalGames)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A202C] rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Total de Jogadores</p>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.totalPlayers)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A202C] rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Prêmios Pagos</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalPrizes)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A202C] rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Total de Chutes</p>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.totalShots)}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
          </div>
        </motion.div>
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

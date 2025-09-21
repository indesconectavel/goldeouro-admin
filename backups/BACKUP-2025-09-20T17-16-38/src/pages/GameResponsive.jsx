import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import FootballField from '../components/FootballField';
import useSocket from '../hooks/useSocket';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import PageTitle from '../components/PageTitle';
import Game from './Game';

const GameResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Game />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_GAME"
      fallback={<Game />}
      desktopFallback={<Game />}
    >
      <GameMobileTablet />
    </ResponsiveWrapper>
  );
};

const GameMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  const [gameState, setGameState] = useState({
    isInQueue: false,
    queuePosition: 0,
    gameId: null,
    gameStatus: 'waiting', // waiting, active, finished
    playersCount: 0,
    shotOptions: [],
    userBalance: 0,
    isShooting: false,
    lastShotResult: null,
    isGoldenGoal: false
  });

  const [showGoldenGoal, setShowGoldenGoal] = useState(false);
  const [nextGoldenGoal, setNextGoldenGoal] = useState(0);

  // Hook do Socket.io
  const { isConnected, joinQueue, leaveQueue, joinGame, leaveGame, notifyShot, useSocketEvent } = useSocket();

  // Carregar opções de chute e dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Escutar eventos de WebSocket
  useSocketEvent('queue-updated', () => {
    console.log('🔄 Fila atualizada via WebSocket');
    checkQueueStatus();
  });

  useSocketEvent('shot-result', (data) => {
    console.log('⚽ Resultado de chute recebido:', data);
    // Atualizar interface com resultado de outro jogador
  });

  const loadInitialData = async () => {
    try {
      // Carregar opções de chute
      const shotOptionsResponse = await api.get('/games/opcoes-chute');
      setGameState(prev => ({
        ...prev,
        shotOptions: shotOptionsResponse.data.data || []
      }));

      // Carregar saldo do usuário
      const balanceResponse = await api.get('/user/balance');
      setGameState(prev => ({
        ...prev,
        userBalance: balanceResponse.data.balance || 0
      }));

      // Verificar status da fila
      await checkQueueStatus();
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const checkQueueStatus = async () => {
    try {
      const response = await api.get('/games/queue-status');
      const data = response.data;
      
      setGameState(prev => ({
        ...prev,
        isInQueue: data.inQueue || false,
        queuePosition: data.position || 0,
        playersCount: data.totalPlayers || 0
      }));
    } catch (error) {
      console.error('Erro ao verificar status da fila:', error);
    }
  };

  const handleJoinQueue = async () => {
    try {
      await joinQueue();
      setGameState(prev => ({
        ...prev,
        isInQueue: true
      }));
    } catch (error) {
      console.error('Erro ao entrar na fila:', error);
    }
  };

  const handleLeaveQueue = async () => {
    try {
      await leaveQueue();
      setGameState(prev => ({
        ...prev,
        isInQueue: false,
        queuePosition: 0
      }));
    } catch (error) {
      console.error('Erro ao sair da fila:', error);
    }
  };

  const handleShot = async (direction) => {
    if (gameState.isShooting) return;

    setGameState(prev => ({
      ...prev,
      isShooting: true
    }));

    try {
      await notifyShot(direction);
      
      // Simular resultado (em produção viria do servidor)
      const isGoal = Math.random() > 0.5;
      const isGoldenGoal = isGoal && Math.random() > 0.8;
      
      setGameState(prev => ({
        ...prev,
        lastShotResult: {
          direction,
          isGoal,
          isGoldenGoal
        },
        isShooting: false
      }));

      if (isGoldenGoal) {
        setShowGoldenGoal(true);
        setTimeout(() => setShowGoldenGoal(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao realizar chute:', error);
      setGameState(prev => ({
        ...prev,
        isShooting: false
      }));
    }
  };

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <PageTitle>⚽ Jogo</PageTitle>
            <p className="text-gray-400 text-sm">Participe dos jogos de chute ao gol</p>
          </div>

          {/* Status do Jogo */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Status do Jogo</h3>
              <p className="text-gray-400 text-sm mb-4">
                {gameState.isInQueue ? `Posição na fila: ${gameState.queuePosition}` : 'Não está na fila'}
              </p>
              <p className="text-gray-400 text-sm">
                Jogadores online: {gameState.playersCount}
              </p>
            </div>
          </div>

          {/* Campo de Futebol */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4 mb-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Campo de Futebol</h3>
            <div className="flex justify-center">
              <FootballField 
                onShot={handleShot}
                isShooting={gameState.isShooting}
                disabled={!gameState.isInQueue}
              />
            </div>
          </div>

          {/* Opções de Chute */}
          {gameState.shotOptions.length > 0 && (
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4 mb-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Opções de Chute</h3>
              <div className="grid grid-cols-1 gap-3">
                {gameState.shotOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleShot(option.direction)}
                    disabled={gameState.isShooting || !gameState.isInQueue}
                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {option.direction} - R$ {option.bet_amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controles da Fila */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4 mb-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Controles</h3>
            <div className="space-y-3">
              {!gameState.isInQueue ? (
                <button
                  onClick={handleJoinQueue}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  Entrar na Fila
                </button>
              ) : (
                <button
                  onClick={handleLeaveQueue}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  Sair da Fila
                </button>
              )}
            </div>
          </div>

          {/* Resultado do Último Chute */}
          {gameState.lastShotResult && (
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Último Resultado</h3>
              <div className="text-center">
                <p className="text-white mb-2">Direção: {gameState.lastShotResult.direction}</p>
                <p className={`text-lg font-bold ${gameState.lastShotResult.isGoal ? 'text-green-400' : 'text-red-400'}`}>
                  {gameState.lastShotResult.isGoal ? 'GOL!' : 'ERROU!'}
                </p>
                {gameState.lastShotResult.isGoldenGoal && (
                  <p className="text-yellow-400 font-bold text-lg">GOL DE OURO! 🏆</p>
                )}
              </div>
            </div>
          )}

          {/* Modal de Gol de Ouro */}
          <AnimatePresence>
            {showGoldenGoal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.5 }}
                  className="bg-[#111827] rounded-lg p-8 text-center border border-yellow-500"
                >
                  <h2 className="text-3xl font-bold text-yellow-400 mb-4">🏆 GOL DE OURO! 🏆</h2>
                  <p className="text-white text-lg">Parabéns! Você marcou um gol de ouro!</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Tablet: Layout em grid
  return (
    <div className="bg-[#000717] text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <PageTitle>⚽ Jogo</PageTitle>
          <p className="text-gray-400 text-lg">Participe dos jogos de chute ao gol em tempo real</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campo de Futebol */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-6 text-center">Campo de Futebol</h3>
            <div className="flex justify-center">
              <FootballField 
                onShot={handleShot}
                isShooting={gameState.isShooting}
                disabled={!gameState.isInQueue}
              />
            </div>
          </div>

          {/* Status e Controles */}
          <div className="space-y-6">
            {/* Status do Jogo */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Status do Jogo</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white font-semibold">
                    {gameState.isInQueue ? 'Na Fila' : 'Fora da Fila'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Posição:</span>
                  <span className="text-white font-semibold">{gameState.queuePosition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Jogadores Online:</span>
                  <span className="text-white font-semibold">{gameState.playersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saldo:</span>
                  <span className="text-green-400 font-semibold">R$ {gameState.userBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Opções de Chute */}
            {gameState.shotOptions.length > 0 && (
              <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Opções de Chute</h3>
                <div className="grid grid-cols-1 gap-3">
                  {gameState.shotOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleShot(option.direction)}
                      disabled={gameState.isShooting || !gameState.isInQueue}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black px-4 py-3 rounded-lg font-semibold transition-colors"
                    >
                      {option.direction} - R$ {option.bet_amount}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Controles da Fila */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Controles</h3>
              <div className="space-y-3">
                {!gameState.isInQueue ? (
                  <button
                    onClick={handleJoinQueue}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Entrar na Fila
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveQueue}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Sair da Fila
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resultado do Último Chute */}
        {gameState.lastShotResult && (
          <div className="mt-8 bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">Último Resultado</h3>
            <div className="text-center">
              <p className="text-white mb-2">Direção: {gameState.lastShotResult.direction}</p>
              <p className={`text-2xl font-bold ${gameState.lastShotResult.isGoal ? 'text-green-400' : 'text-red-400'}`}>
                {gameState.lastShotResult.isGoal ? 'GOL!' : 'ERROU!'}
              </p>
              {gameState.lastShotResult.isGoldenGoal && (
                <p className="text-yellow-400 font-bold text-xl">GOL DE OURO! 🏆</p>
              )}
            </div>
          </div>
        )}

        {/* Modal de Gol de Ouro */}
        <AnimatePresence>
          {showGoldenGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className="bg-[#111827] rounded-lg p-8 text-center border border-yellow-500"
              >
                <h2 className="text-4xl font-bold text-yellow-400 mb-4">🏆 GOL DE OURO! 🏆</h2>
                <p className="text-white text-xl">Parabéns! Você marcou um gol de ouro!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameResponsive;

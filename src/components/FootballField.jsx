import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FootballField = ({ shotOptions, onShotSelect, gameStatus, isShooting, shotResult, isGoldenGoal }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 80 });
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, shooting, result
  const [goalkeeperPosition, setGoalkeeperPosition] = useState({ x: 0, y: 0 });

  const handleZoneClick = (option) => {
    if (gameStatus !== 'active' || isShooting) return;
    
    setSelectedZone(option.id);
    setShowAnimation(true);
    setAnimationPhase('shooting');
    
    // Animar a bola e goleiro
    animateBall(option);
    animateGoalkeeper(option);
    
    // Chamar callback após animação
    setTimeout(() => {
      onShotSelect(option.id);
      setAnimationPhase('result');
      
      // Reset após mostrar resultado
      setTimeout(() => {
        setShowAnimation(false);
        setSelectedZone(null);
        setAnimationPhase('idle');
        setBallPosition({ x: 50, y: 80 });
        setGoalkeeperPosition({ x: 0, y: 0 });
      }, 3000);
    }, 2500);
  };

  const animateBall = (option) => {
    // Calcular posição da zona com trajetória realista
    const zonePositions = {
      1: { x: 20, y: 30 }, // Canto superior esquerdo
      2: { x: 50, y: 20 }, // Centro superior
      3: { x: 80, y: 30 }, // Canto superior direito
      4: { x: 20, y: 50 }, // Canto inferior esquerdo
      5: { x: 80, y: 50 }  // Canto inferior direito
    };

    const targetPosition = zonePositions[option.id] || { x: 50, y: 30 };
    
    // Animar trajetória da bola
    setBallPosition({ x: 50, y: 80 }); // Posição inicial
    
    setTimeout(() => {
      setBallPosition(targetPosition);
    }, 100);
  };

  const animateGoalkeeper = (option) => {
    // Goleiro tenta defender baseado na zona
    const defensePositions = {
      1: { x: -15, y: -5 }, // Move para esquerda
      2: { x: 0, y: -10 },  // Move para frente
      3: { x: 15, y: -5 },  // Move para direita
      4: { x: -10, y: 5 },  // Move para esquerda baixo
      5: { x: 10, y: 5 }    // Move para direita baixo
    };

    const defensePosition = defensePositions[option.id] || { x: 0, y: 0 };
    
    setTimeout(() => {
      setGoalkeeperPosition(defensePosition);
    }, 800);
  };

  const getZoneStyle = (option) => {
    const baseStyle = {
      position: 'absolute',
      borderRadius: '12px',
      border: '2px solid',
      cursor: gameStatus === 'active' && !isShooting ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      minHeight: '80px',
      minWidth: '100px',
    };

    if (selectedZone === option.id) {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        borderColor: '#FFD700',
        transform: 'scale(1.05)',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
      };
    }

    if (gameStatus === 'active' && !isShooting) {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: 'rgba(100, 100, 100, 0.2)',
      borderColor: 'rgba(100, 100, 100, 0.3)',
    };
  };

  const getZonePosition = (option) => {
    const positions = {
      1: { top: '20%', left: '10%' }, // Canto superior esquerdo
      2: { top: '15%', left: '50%', transform: 'translateX(-50%)' }, // Centro superior
      3: { top: '20%', right: '10%' }, // Canto superior direito
      4: { top: '60%', left: '10%' }, // Canto inferior esquerdo
      5: { top: '60%', right: '10%' }  // Canto inferior direito
    };

    return positions[option.id] || { top: '50%', left: '50%' };
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-green-600 to-green-700 rounded-xl overflow-hidden border-4 border-white/20">
      {/* Linhas do campo */}
      <div className="absolute inset-0">
        {/* Linha central */}
        <div className="absolute top-0 left-1/2 w-1 h-full bg-white/30 transform -translate-x-1/2"></div>
        {/* Círculo central */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        {/* Área do gol */}
        <div className="absolute top-0 left-1/2 w-24 h-16 border-2 border-white/30 transform -translate-x-1/2"></div>
        <div className="absolute top-0 left-1/2 w-8 h-8 border-2 border-white/30 rounded-full transform -translate-x-1/2"></div>
      </div>

      {/* Goleiro */}
      <motion.div
        className="absolute top-4 left-1/2 transform -translate-x-1/2"
        animate={showAnimation ? { 
          x: [0, goalkeeperPosition.x, goalkeeperPosition.x * 0.5, 0],
          y: [0, goalkeeperPosition.y, goalkeeperPosition.y * 0.5, 0],
          rotate: [0, goalkeeperPosition.x * 2, goalkeeperPosition.x, 0]
        } : {}}
        transition={{ 
          duration: 1.5, 
          ease: "easeInOut",
          times: [0, 0.6, 0.8, 1]
        }}
      >
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/30">
          🥅
        </div>
      </motion.div>

      {/* Bola */}
      <motion.div
        className="absolute w-6 h-6 bg-white rounded-full shadow-lg z-10"
        style={{
          left: `${ballPosition.x}%`,
          top: `${ballPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={showAnimation ? {
          scale: [1, 1.3, 0.8, 1],
          rotate: [0, 180, 360, 540],
          y: [0, -20, 0, 0]
        } : {}}
        transition={{ 
          duration: 2.5, 
          ease: "easeInOut",
          times: [0, 0.3, 0.7, 1]
        }}
      >
        ⚽
      </motion.div>

      {/* Zonas de Chute */}
      {shotOptions.map((option) => (
        <motion.div
          key={option.id}
          style={{
            ...getZoneStyle(option),
            ...getZonePosition(option)
          }}
          onClick={() => handleZoneClick(option)}
          whileHover={gameStatus === 'active' && !isShooting ? { 
            scale: 1.05,
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
          } : {}}
          whileTap={gameStatus === 'active' && !isShooting ? { scale: 0.95 } : {}}
        >
          <div className="text-center text-white">
            <div className="text-lg font-bold mb-1">{option.name}</div>
            <div className="text-xs opacity-80">{option.description}</div>
            <div className="text-xs opacity-60 mt-1">
              Dificuldade: {option.difficulty_level}/5
            </div>
          </div>
        </motion.div>
      ))}

      {/* Efeitos de resultado */}
      <AnimatePresence>
        {animationPhase === 'result' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Efeito de Gol */}
            {shotResult === 'goal' && (
              <>
                {/* Confetes dourados */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                    style={{
                      left: `${ballPosition.x}%`,
                      top: `${ballPosition.y}%`,
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 0.8, 0],
                      x: Math.cos(i * 18 * Math.PI / 180) * (100 + Math.random() * 50),
                      y: Math.sin(i * 18 * Math.PI / 180) * (100 + Math.random() * 50),
                    }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                ))}
                
                {/* Texto "GOL!" */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="text-6xl font-bold text-yellow-400 drop-shadow-lg">
                    {isGoldenGoal ? '🏆 GOL DE OURO! 🏆' : '⚽ GOL! ⚽'}
                  </div>
                </motion.div>
              </>
            )}

            {/* Efeito de Erro */}
            {shotResult === 'miss' && (
              <>
                {/* Partículas de poeira */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gray-400 rounded-full"
                    style={{
                      left: `${ballPosition.x}%`,
                      top: `${ballPosition.y}%`,
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 0.5, 0],
                      x: Math.cos(i * 30 * Math.PI / 180) * 80,
                      y: Math.sin(i * 30 * Math.PI / 180) * 80,
                    }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                ))}
                
                {/* Texto "ERROU!" */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="text-4xl font-bold text-red-400 drop-shadow-lg">
                    ❌ ERROU! ❌
                  </div>
                </motion.div>
              </>
            )}

            {/* Efeito especial do Gol de Ouro */}
            {isGoldenGoal && shotResult === 'goal' && (
              <>
                {/* Raios dourados */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`ray-${i}`}
                    className="absolute w-1 h-20 bg-gradient-to-t from-yellow-400 to-transparent"
                    style={{
                      left: `${ballPosition.x}%`,
                      top: `${ballPosition.y}%`,
                      transformOrigin: 'bottom center',
                      transform: `rotate(${i * 45}deg) translate(-50%, -100%)`
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, delay: 1, repeat: 2 }}
                  />
                ))}
                
                {/* Estrelas douradas */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute text-2xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ scale: 0, opacity: 0, rotate: 0 }}
                    animate={{ 
                      scale: [0, 1, 0], 
                      opacity: [0, 1, 0],
                      rotate: [0, 360, 720]
                    }}
                    transition={{ duration: 2, delay: 1.5 + i * 0.1 }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruções */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <motion.p
          className="text-white/80 text-sm font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {gameStatus === 'active' 
            ? (isShooting ? 'Executando chute...' : 'Escolha uma zona para chutar!')
            : 'Aguardando partida iniciar...'
          }
        </motion.p>
      </div>

      {/* Overlay de loading */}
      {isShooting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <div className="text-white text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"
            />
            <p>Executando chute...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FootballField;

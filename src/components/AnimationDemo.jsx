import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FootballField from './FootballField';

const AnimationDemo = () => {
  const [demoState, setDemoState] = useState({
    gameStatus: 'active',
    isShooting: false,
    shotResult: null,
    isGoldenGoal: false
  });

  const shotOptions = [
    { id: 1, name: 'Canto Superior Esquerdo', description: 'Chute no canto', difficulty_level: 3 },
    { id: 2, name: 'Centro Superior', description: 'Chute no centro', difficulty_level: 2 },
    { id: 3, name: 'Canto Superior Direito', description: 'Chute no canto', difficulty_level: 3 },
    { id: 4, name: 'Canto Inferior Esquerdo', description: 'Chute baixo', difficulty_level: 4 },
    { id: 5, name: 'Canto Inferior Direito', description: 'Chute baixo', difficulty_level: 4 }
  ];

  const handleShotSelect = (shotOptionId) => {
    setDemoState(prev => ({ ...prev, isShooting: true }));
    
    // Simular resultado após 3 segundos
    setTimeout(() => {
      const isGoal = Math.random() > 0.5;
      const isGolden = Math.random() > 0.9; // 10% chance de ser gol de ouro
      
      setDemoState(prev => ({
        ...prev,
        isShooting: false,
        shotResult: isGoal ? 'goal' : 'miss',
        isGoldenGoal: isGoal && isGolden
      }));

      // Reset após 5 segundos
      setTimeout(() => {
        setDemoState(prev => ({
          ...prev,
          shotResult: null,
          isGoldenGoal: false
        }));
      }, 5000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000717] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          🎬 Demonstração das Animações do Jogo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campo de Futebol */}
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              ⚽ Campo de Futebol
            </h2>
            
            <FootballField
              shotOptions={shotOptions}
              onShotSelect={handleShotSelect}
              gameStatus={demoState.gameStatus}
              isShooting={demoState.isShooting}
              shotResult={demoState.shotResult}
              isGoldenGoal={demoState.isGoldenGoal}
            />
          </div>

          {/* Controles de Demonstração */}
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              🎮 Controles de Demonstração
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Status do Jogo:</h3>
                <p className="text-gray-300">
                  {demoState.gameStatus === 'active' ? '✅ Ativo' : '⏸️ Pausado'}
                </p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Último Resultado:</h3>
                <p className="text-gray-300">
                  {demoState.shotResult === 'goal' ? '⚽ GOL!' : 
                   demoState.shotResult === 'miss' ? '❌ ERROU!' : 
                   '⏳ Aguardando...'}
                </p>
              </div>

              {demoState.isGoldenGoal && (
                <div className="p-4 bg-yellow-900 rounded-lg border border-yellow-500">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">🏆 GOL DE OURO!</h3>
                  <p className="text-yellow-300">
                    Parabéns! Você fez o milésimo chute e ganhou R$50!
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-900 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">📋 Instruções:</h3>
                <ul className="text-blue-300 space-y-1 text-sm">
                  <li>• Clique em uma zona para chutar</li>
                  <li>• Observe a animação da bola e goleiro</li>
                  <li>• Veja os efeitos de gol ou erro</li>
                  <li>• Teste o efeito especial do Gol de Ouro</li>
                </ul>
              </div>

              <button
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  shotResult: null, 
                  isGoldenGoal: false,
                  isShooting: false
                }))}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              >
                🔄 Reset Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDemo;

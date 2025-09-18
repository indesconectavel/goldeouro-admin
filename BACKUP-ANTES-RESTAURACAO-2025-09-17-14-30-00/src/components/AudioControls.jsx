import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from '../hooks/useSound';

const AudioControls = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showControls, setShowControls] = useState(false);
  const { setVolume: setGlobalVolume, sounds } = useSound();

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedMuted = localStorage.getItem('audio-muted');
    const savedVolume = localStorage.getItem('audio-volume');
    
    if (savedMuted !== null) {
      setIsMuted(JSON.parse(savedMuted));
    }
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      setGlobalVolume(vol);
    }
  }, [setGlobalVolume]);

  // Salvar preferências no localStorage
  useEffect(() => {
    localStorage.setItem('audio-muted', JSON.stringify(isMuted));
    localStorage.setItem('audio-volume', volume.toString());
    setGlobalVolume(volume);
  }, [isMuted, volume, setGlobalVolume]);

  // Atualizar volume quando mudar
  useEffect(() => {
    const newVolume = isMuted ? 0 : volume;
    setGlobalVolume(newVolume);
  }, [isMuted, volume, setGlobalVolume]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    // Tocar som apenas quando não estiver mutado
    if (!newMutedState) {
      sounds.buttonClick();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setGlobalVolume(newVolume);
    // Não alterar o estado de mute automaticamente
    // O usuário deve usar o botão de mute explicitamente
  };

  const testSound = () => {
    // Usar a função de teste do hook useSound
    sounds.test();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botão principal */}
      <motion.button
        onClick={() => setShowControls(!showControls)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full shadow-lg transition-colors"
        title="Controles de Áudio"
      >
        <motion.div
          animate={{ 
            scale: isMuted ? 0.8 : 1,
            opacity: isMuted ? 0.5 : 1 
          }}
          transition={{ duration: 0.2 }}
        >
          {isMuted ? '🔇' : '🔊'}
        </motion.div>
      </motion.button>

      {/* Painel de controles */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-[#1A202C] border border-gray-700 rounded-lg p-4 shadow-xl min-w-[200px]"
          >
            <div className="space-y-3">
              {/* Título */}
              <h3 className="text-white font-bold text-sm">🎵 Controles de Áudio</h3>
              
              {/* Botão de mute */}
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Som:</span>
                <motion.button
                  onClick={toggleMute}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isMuted 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isMuted ? '🔇 Mutado' : '🔊 Ativo'}
                </motion.button>
              </div>

              {/* Controle de volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Volume:</span>
                  <span className="text-yellow-400 text-sm font-bold">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #FCD34D 0%, #FCD34D ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                  }}
                />
              </div>

              {/* Botão de teste */}
              <motion.button
                onClick={testSound}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
              >
                🎵 Testar Som
              </motion.button>


            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos para o slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #FCD34D;
          cursor: pointer;
          border: 2px solid #1A202C;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #FCD34D;
          cursor: pointer;
          border: 2px solid #1A202C;
        }
      `}</style>
    </div>
  );
};

export default AudioControls;

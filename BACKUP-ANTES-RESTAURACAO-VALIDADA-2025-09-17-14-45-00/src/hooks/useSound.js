import { useRef, useCallback } from 'react';

const useSound = () => {
  const audioRefs = useRef({});

  // Função para carregar e tocar um som (com fallback para não causar erros)
  const playSound = useCallback((soundName, volume = 0.7) => {
    try {
      // Se o áudio já foi carregado, apenas toca
      if (audioRefs.current[soundName]) {
        audioRefs.current[soundName].currentTime = 0;
        audioRefs.current[soundName].volume = volume;
        audioRefs.current[soundName].play().catch(() => {
          // Fallback silencioso se não conseguir tocar
          console.log(`Som ${soundName} não disponível`);
        });
        return;
      }

      // Carrega o áudio pela primeira vez
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.volume = volume;
      audio.preload = 'auto';
      
      // Adiciona tratamento de erro para arquivo não encontrado
      audio.addEventListener('error', () => {
        console.log(`Arquivo de som ${soundName}.mp3 não encontrado - usando fallback silencioso`);
      });
      
      // Armazena a referência
      audioRefs.current[soundName] = audio;
      
      // Toca o som com fallback silencioso
      audio.play().catch(() => {
        console.log(`Som ${soundName} não disponível - usando fallback silencioso`);
      });
    } catch (error) {
      // Fallback silencioso para qualquer erro
      console.log(`Erro ao tocar som ${soundName} - usando fallback silencioso:`, error.message);
    }
  }, []);

  // Função para testar som (cria um som sintético se não houver arquivos)
  const testSound = useCallback(() => {
    try {
      // Tenta tocar um som existente primeiro
      playSound('button-click', 0.5);
      
      // Se não funcionar, cria um som sintético
      setTimeout(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Som de teste mais agradável (tom de sucesso)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        console.log('🎵 Som de teste sintético tocado (tom de sucesso)');
      }, 100);
    } catch (error) {
      console.log('Erro ao tocar som de teste:', error.message);
    }
  }, [playSound]);

  // Função para parar um som
  const stopSound = useCallback((soundName) => {
    if (audioRefs.current[soundName]) {
      audioRefs.current[soundName].pause();
      audioRefs.current[soundName].currentTime = 0;
    }
  }, []);

  // Função para parar todos os sons
  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, []);

  // Função para definir volume global
  const setVolume = useCallback((volume) => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
      }
    });
  }, []);

  // Sons específicos do jogo
  const sounds = {
    // Sons de resultado
    goal: () => playSound('goal', 0.8),
    miss: () => playSound('miss', 0.6),
    goldenGoal: () => playSound('golden-goal', 0.9),
    
    // Sons de interface
    buttonClick: () => playSound('button-click', 0.5),
    buttonHover: () => playSound('button-hover', 0.3),
    notification: () => playSound('notification', 0.6),
    
    // Sons de jogo
    queueJoin: () => playSound('queue-join', 0.7),
    queueLeave: () => playSound('queue-leave', 0.5),
    gameStart: () => playSound('game-start', 0.8),
    gameEnd: () => playSound('game-end', 0.7),
    
    // Sons de animação
    ballKick: () => playSound('ball-kick', 0.7),
    goalkeeperSave: () => playSound('goalkeeper-save', 0.6),
    crowdCheer: () => playSound('crowd-cheer', 0.8),
    crowdDisappoint: () => playSound('crowd-disappoint', 0.5),
    
    // Função de teste
    test: testSound
  };

  return {
    playSound,
    stopSound,
    stopAllSounds,
    setVolume,
    sounds
  };
};

export default useSound;

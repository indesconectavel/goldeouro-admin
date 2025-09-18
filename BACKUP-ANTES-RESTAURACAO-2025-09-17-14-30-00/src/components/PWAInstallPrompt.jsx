import React, { useState, useEffect } from 'react';
import usePWA from '../hooks/usePWA';

const PWAInstallPrompt = () => {
  const { showInstallPrompt, installApp, isInstalled } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar se o prompt foi dispensado
    const dismissedPrompt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedPrompt) {
      const dismissedTime = parseInt(dismissedPrompt);
      const now = Date.now();
      const daysSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Mostrar novamente após 7 dias
      if (daysSinceDismissed < 7) {
        setDismissed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (showInstallPrompt && !isInstalled && !dismissed) {
      setShowPrompt(true);
    }
  }, [showInstallPrompt, isInstalled, dismissed]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-[#1A202C] border border-yellow-500 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">
              Instalar App
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Instale o Gol de Ouro Admin para acesso rápido e funcionalidades offline.
            </p>
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleInstall}
                className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-semibold px-3 py-1.5 rounded transition duration-200"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition duration-200"
              >
                Agora não
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-white"
          >
            <span className="sr-only">Fechar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
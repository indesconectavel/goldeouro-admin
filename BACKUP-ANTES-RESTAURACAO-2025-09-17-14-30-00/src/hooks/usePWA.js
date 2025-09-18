import { useState, useEffect } from 'react';

const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Verificar se está online
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar se já está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isInApp);
    };

    checkIfInstalled();

    // Interceptar prompt de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verificar se foi instalado
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ App instalado pelo usuário');
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
        return true;
      } else {
        console.log('❌ Instalação cancelada pelo usuário');
        return false;
      }
    } catch (error) {
      console.error('Erro ao instalar app:', error);
      return false;
    }
  };

  const shareContent = async (data) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        return false;
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(data.url || data.text);
          return true;
        } catch (error) {
          console.error('Erro ao copiar para clipboard:', error);
          return false;
        }
      }
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return 'not-supported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  };

  const showNotification = (title, options = {}) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  };

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  const checkForUpdates = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
  };

  return {
    isOnline,
    isInstalled,
    showInstallPrompt,
    installApp,
    shareContent,
    requestNotificationPermission,
    showNotification,
    updateServiceWorker,
    checkForUpdates
  };
};

export default usePWA;
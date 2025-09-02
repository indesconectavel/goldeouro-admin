import React, { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import AudioControls from "./components/AudioControls";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";

export default function App() {
  // Registrar service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.error('❌ Erro ao registrar Service Worker:', error);
        });
    }
  }, []);

  return (
    <div className="dark">
      <AppRoutes />
      <AudioControls />
      <PWAInstallPrompt />
      <OfflineIndicator />
    </div>
  );
}

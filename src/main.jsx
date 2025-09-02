import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./shared/ErrorBoundary";
import "./index.css";

// Loading component para Suspense
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
      <p className="text-lg">Carregando...</p>
    </div>
  </div>
);

// Guardrails para desenvolvimento
if (import.meta.env.DEV) {
  // Listener para erros globais
  window.addEventListener('error', (event) => {
    console.error('🚨 Erro global capturado:', event.error);
    
    // Banner discreto em dev
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; 
      background: #dc2626; color: white; padding: 8px; 
      text-align: center; z-index: 9999; font-size: 12px;
    `;
    banner.textContent = `Erro: ${event.error.message}`;
    document.body.appendChild(banner);
    
    setTimeout(() => banner.remove(), 5000);
  });

  // Listener para promises rejeitadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Promise rejeitada não tratada:', event.reason);
    
    // Banner discreto em dev
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; 
      background: #ea580c; color: white; padding: 8px; 
      text-align: center; z-index: 9999; font-size: 12px;
    `;
    banner.textContent = `Promise rejeitada: ${event.reason}`;
    document.body.appendChild(banner);
    
    setTimeout(() => banner.remove(), 5000);
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

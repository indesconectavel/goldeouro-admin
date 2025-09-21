import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-emergency.jsx';
import './index.css';

// Função para verificar se há erros
const handleError = (error) => {
  console.error('Erro capturado:', error);
  // Não fazer nada, deixar o app funcionar
};

// Capturar erros globais
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', handleError);

// Renderizar app
const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Erro ao renderizar:', error);
  // Fallback simples
  root.render(
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f3f4f6',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>Gol de Ouro Admin</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>Sistema em manutenção. Tente novamente em alguns minutos.</p>
      <button 
        onClick={() => window.location.reload()} 
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Recarregar Página
      </button>
    </div>
  );
}

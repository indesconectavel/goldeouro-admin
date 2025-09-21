import React, { useState } from 'react';
import './App-no-tailwind.css';

// Componente de Login Simples
const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === 'goldeouro_admin' && credentials.password === 'G0ld3@0ur0_2025!') {
      onLogin(true);
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1>Gol de Ouro</h1>
          <p>Painel Admin</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="goldeouro_admin"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="G0ld3@0ur0_2025!"
              required
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente de Dashboard Simples
const Dashboard = ({ onLogout }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Painel Administrativo</h1>
        <button onClick={onLogout} className="logout-button">
          Sair
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Usuários</h3>
            <p className="stat-number">1</p>
          </div>
          
          <div className="stat-card">
            <h3>Jogos</h3>
            <p className="stat-number">0</p>
          </div>
          
          <div className="stat-card">
            <h3>Apostas</h3>
            <p className="stat-number">0</p>
          </div>
          
          <div className="stat-card">
            <h3>Na Fila</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        
        <div className="system-card">
          <h2>Sistema de Jogos</h2>
          <p>Painel administrativo funcionando corretamente!</p>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (success) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
};

export default App;




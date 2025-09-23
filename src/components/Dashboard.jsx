import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Painel de controle do Gol de Ouro</p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Usuários</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Jogos</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Saques</h3>
          <p>0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

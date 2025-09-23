import React from 'react';
import { Link } from 'react-router-dom';

const Saques = () => {
  return (
    <div className="saques-container">
      <h1>Saques</h1>
      <p>Gerenciar solicitações de saque</p>
      <div className="saques-actions">
        <button className="btn-primary">Aprovar Saques</button>
        <button className="btn-secondary">Exportar Relatório</button>
      </div>
      <div className="saques-list">
        <p>Lista de saques será exibida aqui</p>
      </div>
      <Link to="/dashboard" className="btn-back">← Voltar ao Dashboard</Link>
    </div>
  );
};

export default Saques;

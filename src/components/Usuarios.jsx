import React from 'react';
import { Link } from 'react-router-dom';

const Usuarios = () => {
  return (
    <div className="usuarios-container">
      <h1>Usuários</h1>
      <p>Gerenciar usuários do sistema</p>
      <div className="usuarios-actions">
        <button className="btn-primary">Adicionar Usuário</button>
        <button className="btn-secondary">Exportar Lista</button>
      </div>
      <div className="usuarios-list">
        <p>Lista de usuários será exibida aqui</p>
      </div>
      <Link to="/dashboard" className="btn-back">← Voltar ao Dashboard</Link>
    </div>
  );
};

export default Usuarios;

// src/pages/Estatisticas.jsx

import React from "react";

const Estatisticas = () => {
  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="bg-card p-6 rounded shadow-md max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Estatísticas</h1>
        <p className="text-muted-foreground mb-6">
          Painel com dados de desempenho, uso da plataforma e engajamento dos jogadores.
        </p>

        <div className="text-center text-sm text-gray-400 mt-20">
          Ainda não possui dados para exibir estatísticas.
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;

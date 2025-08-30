import React from 'react';

const RelatorioGeral = () => {
  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/relatorio-geral-csv';
    window.open(url, '_blank');
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-8 flex items-center justify-center">
      <div className="bg-card text-foreground p-8 rounded-lg shadow-md w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Relatório Geral da Plataforma</h1>
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          Aqui você pode exportar um arquivo CSV contendo todos os dados consolidados da plataforma,
          incluindo usuários, transações, saques e partidas finalizadas. Esse relatório é ideal para
          auditoria e conferência semanal.
        </p>
        <button
          onClick={handleExport}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg text-lg transition duration-200"
        >
          Exportar Relatório Completo
        </button>
      </div>
    </div>
  );
};

export default RelatorioGeral;

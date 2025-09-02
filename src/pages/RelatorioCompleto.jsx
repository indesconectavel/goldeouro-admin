import React from 'react';

export default function RelatorioCompleto() {
  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/relatorio-completo-csv';
    window.open(url, "_blank");
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-yellow-600 mb-4">Relatório Completo</h1>
      <p className="text-gray-700 mb-6">
        Clique no botão abaixo para exportar todos os dados em um único arquivo.
      </p>
      <button
        onClick={handleExport}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded"
      >
        📥 Baixar Relatório Completo (CSV)
      </button>
    </div>
  );
}

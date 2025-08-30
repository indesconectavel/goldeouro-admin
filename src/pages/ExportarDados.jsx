import React from "react";

const ExportarDados = () => {
  const handleExport = (tipo) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + `/admin/exportar/${tipo}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="bg-card p-6 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Exportação de Dados</h1>
        <p className="text-muted-foreground mb-6">
          Faça o download de relatórios completos no formato CSV para auditoria, backup ou
          integração com outras ferramentas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <button
            onClick={() => handleExport("usuarios-csv")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded transition"
          >
            Exportar Usuários
          </button>

          <button
            onClick={() => handleExport("chutes-csv")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded transition"
          >
            Exportar Chutes
          </button>

          <button
            onClick={() => handleExport("transacoes-csv")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded transition"
          >
            Exportar Transações
          </button>

          <button
            onClick={() => handleExport("saques-csv")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded transition"
          >
            Exportar Saques
          </button>

          <button
            onClick={() => handleExport("relatorio-geral-csv")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded transition col-span-full"
          >
            Exportar Relatório Geral
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportarDados;

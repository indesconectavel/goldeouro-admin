import React from 'react';

export default function RelatorioCompleto() {
  const handleDownload = () => {
    const url = import.meta.env.VITE_API_URL + '/admin/exportar/relatorio-completo-csv';
    const token = import.meta.env.VITE_ADMIN_TOKEN;

    fetch(url, {
      method: 'GET',
      headers: {
        'x-admin-token': token,
      },
    })
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'relatorio_completo.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Erro ao baixar o relatório:', error);
        alert('Erro ao baixar o relatório.');
      });
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-yellow-600 mb-4">Relatório Completo</h1>
      <p className="text-gray-700 mb-6">
        Clique no botão abaixo para exportar todos os dados em um único arquivo.
      </p>
      <button
        onClick={handleDownload}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded"
      >
        📥 Baixar Relatório Completo (CSV)
      </button>
    </div>
  );
}

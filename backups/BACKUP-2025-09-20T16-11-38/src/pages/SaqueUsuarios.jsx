import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';

const SaqueUsuarios = () => {
  const [saques, setSaques] = useState([]);

  useEffect(() => {
    async function fetchSaques() {
      const result = await postData('/admin/relatorio-saques', {});
      if (Array.isArray(result)) {
        setSaques(result);
      }
    }
    fetchSaques();
  }, []);

  const exportarCSV = () => {
    const url = import.meta.env.VITE_API_URL + '/admin/exportar/saques-csv';
    window.open(url, '_blank');
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-600">Relatório de Saques</h1>
        <button
          onClick={exportarCSV}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 border-b">ID</th>
              <th className="text-left p-3 border-b">Usuário</th>
              <th className="text-left p-3 border-b">Valor</th>
              <th className="text-left p-3 border-b">Status</th>
              <th className="text-left p-3 border-b">Data</th>
            </tr>
          </thead>
          <tbody>
            {saques.map((saque, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b">{saque.id}</td>
                <td className="p-3 border-b">{saque.user_id}</td>
                <td className="p-3 border-b">R$ {saque.amount.toFixed(2)}</td>
                <td className="p-3 border-b">{saque.status}</td>
                <td className="p-3 border-b">{new Date(saque.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {saques.length === 0 && (
          <p className="text-gray-500 mt-4">Nenhum saque registrado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default SaqueUsuarios;

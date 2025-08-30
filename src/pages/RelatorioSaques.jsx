import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const RelatorioSaques = () => {
  const [saques, setSaques] = useState([]);

  useEffect(() => {
    const fetchSaques = async () => {
      try {
        const response = await api.post('/admin/relatorio-saques', {});
        setSaques(response.data);
      } catch (error) {
        console.error('Erro ao buscar saques:', error);
      }
    };

    fetchSaques();
  }, []);

  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/saques-csv';
    window.open(url, "_blank");
  };

  if (!saques.length) return <Loader />;

  return (
    <div className="bg-[#000717] text-white p-8 rounded shadow-md max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório de Saques</h1>
        <button
          onClick={handleExport}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-700 rounded-lg shadow-sm">
          <thead className="bg-[#111827] text-yellow-300 uppercase text-sm">
            <tr>
              <th className="px-4 py-3 border border-gray-700">Usuário</th>
              <th className="px-4 py-3 border border-gray-700 text-red-400">Valor (R$)</th>
              <th className="px-4 py-3 border border-gray-700">Status</th>
              <th className="px-4 py-3 border border-gray-700">Data</th>
            </tr>
          </thead>
          <tbody>
            {saques.map((saque) => (
              <tr key={saque.id} className="text-center hover:bg-[#1f2937] text-sm">
                <td className="px-4 py-2 border border-gray-700 font-medium">{saque.user_name}</td>
                <td className="px-4 py-2 border border-gray-700 text-red-400 font-semibold">R$ {saque.amount}</td>
                <td className="px-4 py-2 border border-gray-700">{saque.status}</td>
                <td className="px-4 py-2 border border-gray-700">
                  {new Date(saque.created_at).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatorioSaques;

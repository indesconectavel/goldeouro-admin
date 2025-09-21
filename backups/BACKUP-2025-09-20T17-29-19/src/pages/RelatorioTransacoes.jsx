import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const RelatorioTransacoes = () => {
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await api.post('/admin/relatorio-transacoes', {});
        setTransacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      }
    };

    fetchTransacoes();
  }, []);

  const exportarCSV = () => {
    const url = import.meta.env.VITE_API_URL + '/admin/exportar/transacoes-csv';
    window.open(url, '_blank');
  };

  if (!transacoes.length) return <Loader />;

  return (
    <div className="bg-[#000717] text-white p-8 rounded shadow-md max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório de Transações</h1>
        <button
          onClick={exportarCSV}
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
              <th className="px-4 py-3 border border-gray-700">Tipo</th>
              <th className="px-4 py-3 border border-gray-700">Valor (R$)</th>
              <th className="px-4 py-3 border border-gray-700">Data</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((transacao) => (
              <tr key={transacao.id} className="text-center hover:bg-[#1f2937] text-sm">
                <td className="px-4 py-2 border border-gray-700 font-medium">{transacao.user_name}</td>
                <td className="px-4 py-2 border border-gray-700">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-bold ${
                      transacao.type === 'credit' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {transacao.type === 'credit' ? 'Crédito' : 'Débito'}
                  </span>
                </td>
                <td className="px-4 py-2 border border-gray-700 font-semibold">
                  R$ {transacao.amount}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  {new Date(transacao.transaction_date).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatorioTransacoes;

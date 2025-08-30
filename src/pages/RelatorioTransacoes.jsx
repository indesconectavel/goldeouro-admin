import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const RelatorioTransacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        // ✅ endpoint correto (POST)
        const { data } = await api.post('/admin/transacoes-recentes', {});
        setTransacoes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
        setErro('Não foi possível carregar as transações.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransacoes();
  }, []);

  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/transacoes-csv';
    window.open(url, "_blank");
  };

  if (loading) return <Loader />;

  if (erro) {
    return (
      <div className="bg-[#000717] text-white p-8 rounded max-w-3xl mx-auto mt-10 text-center">
        <h1 className="text-xl font-bold text-yellow-400 mb-4">Relatório de Transações</h1>
        <p className="text-red-400">{erro}</p>
      </div>
    );
  }

  if (!transacoes.length) {
    return (
      <div className="bg-[#000717] text-white p-8 rounded max-w-3xl mx-auto mt-10 text-center">
        <h1 className="text-xl font-bold text-yellow-400 mb-4">Relatório de Transações</h1>
        <p className="text-gray-400">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#000717] text-white p-8 rounded shadow-md max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório de Transações</h1>
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
              <th className="px-4 py-3 border border-gray-700">Tipo</th>
              <th className="px-4 py-3 border border-gray-700">Valor (R$)</th>
              <th className="px-4 py-3 border border-gray-700">Data</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id} className="text-center hover:bg-[#1f2937] text-sm">
                <td className="px-4 py-2 border border-gray-700">{t.user_name ?? t.user_id}</td>
                <td className="px-4 py-2 border border-gray-700">
                  <span className={`px-2 py-1 rounded text-white text-xs font-bold ${t.type === 'credit' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {t.type === 'credit' ? 'Crédito' : 'Débito'}
                  </span>
                </td>
                <td className="px-4 py-2 border border-gray-700">R$ {Number(t.amount).toFixed(2)}</td>
                <td className="px-4 py-2 border border-gray-700">
                  {new Date(t.transaction_date).toLocaleString('pt-BR')}
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

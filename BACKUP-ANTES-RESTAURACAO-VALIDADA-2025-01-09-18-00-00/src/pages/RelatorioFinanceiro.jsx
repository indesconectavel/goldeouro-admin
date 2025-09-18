import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function RelatorioFinanceiro() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await postData('/admin/relatorio-semanal', {});
        setDados(result);
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="ml-64 p-6 text-gray-400">Carregando dados financeiros...</div>
    );
  }

  if (!dados || (!dados.credits && !dados.debits && !dados.balance)) {
    return (
      <div className="ml-64 p-6 text-gray-400">Ainda não possui dados financeiros...</div>
    );
  }

  const { credits, debits, balance } = dados;

  return (
    <div className="ml-64 p-8 min-h-screen bg-background text-foreground">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Financeiro Semanal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-800 p-6 rounded shadow text-white text-center">
          <h2 className="text-lg font-semibold mb-2">Entradas</h2>
          <p className="text-2xl font-bold text-green-300">R$ {credits.toFixed(2)}</p>
        </div>
        <div className="bg-red-800 p-6 rounded shadow text-white text-center">
          <h2 className="text-lg font-semibold mb-2">Saques</h2>
          <p className="text-2xl font-bold text-red-300">R$ {debits.toFixed(2)}</p>
        </div>
        <div className="bg-blue-800 p-6 rounded shadow text-white text-center">
          <h2 className="text-lg font-semibold mb-2">Saldo da Plataforma</h2>
          <p className="text-2xl font-bold text-blue-300">R$ {balance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

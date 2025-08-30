import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function RelatorioFinanceiro() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await postData('/admin/relatorio-semanal', {});
        setDados(result);
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
        setError('Não foi possível carregar os dados financeiros. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Financeiro Semanal</h1>
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
            <p className="text-gray-400">Carregando dados financeiros...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Financeiro Semanal</h1>
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dados || (!dados.credits && !dados.debits && !dados.balance)) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Financeiro Semanal</h1>
          <p className="text-center text-gray-400 p-8">Ainda não possui dados financeiros...</p>
        </div>
      </div>
    );
  }

  const { credits, debits, balance } = dados;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
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
    </div>
  );
}

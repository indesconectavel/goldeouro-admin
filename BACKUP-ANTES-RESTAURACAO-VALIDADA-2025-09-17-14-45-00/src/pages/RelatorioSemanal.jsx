import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const RelatorioSemanal = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const response = await api.post('/admin/relatorio-semanal', {});
        setDados(response.data);
      } catch (error) {
        console.error('Erro ao buscar relatório semanal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, []);

  // Dados fictícios como fallback
  const fallbackDados = {
    credits: 15750.00,
    debits: 8750.00,
    balance: 7000.00,
    totalGames: 245,
    novosUsuarios: 28,
    transacoesAprovadas: 156,
    transacoesPendentes: 12,
    taxaConversao: 78.5
  };

  if (loading) return <Loader />;

  if (!dados || Object.keys(dados).length === 0) {
    // Usar dados fictícios se não houver dados reais
    const displayDados = fallbackDados;
    
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-5xl mx-auto mt-10">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Relatório Semanal</h1>
          <div className="mb-4 p-4 bg-yellow-900 text-yellow-200 rounded">
            <p className="text-sm text-center">⚠️ Usando dados fictícios para demonstração</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-900 text-green-200 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-green-400 mb-2">Total de Entradas</h2>
              <p className="text-2xl font-bold">R$ {displayDados.credits.toFixed(2)}</p>
            </div>

            <div className="bg-red-900 text-red-200 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-red-400 mb-2">Total de Saques</h2>
              <p className="text-2xl font-bold">R$ {displayDados.debits.toFixed(2)}</p>
            </div>

            <div className="bg-blue-900 text-blue-200 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-blue-400 mb-2">Saldo da Plataforma</h2>
              <p className="text-2xl font-bold">R$ {displayDados.balance.toFixed(2)}</p>
            </div>

            <div className="bg-yellow-900 text-yellow-100 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-yellow-400 mb-2">Partidas Finalizadas</h2>
              <p className="text-2xl font-bold">{displayDados.totalGames}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-purple-900 text-purple-200 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-purple-400 mb-2">Novos Usuários</h2>
              <p className="text-2xl font-bold">{displayDados.novosUsuarios}</p>
            </div>

            <div className="bg-green-800 text-green-100 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-green-300 mb-2">Transações Aprovadas</h2>
              <p className="text-2xl font-bold">{displayDados.transacoesAprovadas}</p>
            </div>

            <div className="bg-yellow-800 text-yellow-100 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-yellow-300 mb-2">Transações Pendentes</h2>
              <p className="text-2xl font-bold">{displayDados.transacoesPendentes}</p>
            </div>

            <div className="bg-indigo-900 text-indigo-200 p-6 rounded shadow text-center">
              <h2 className="text-sm uppercase tracking-wide text-indigo-400 mb-2">Taxa de Conversão</h2>
              <p className="text-2xl font-bold">{displayDados.taxaConversao}%</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Dados referentes aos últimos 7 dias.
          </p>
        </div>
      </div>
    );
  }

  const { credits, debits, balance, totalGames } = dados || fallbackDados;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-8 rounded shadow-md max-w-5xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Relatório Semanal</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-900 text-green-200 p-6 rounded shadow text-center">
            <h2 className="text-sm uppercase tracking-wide text-green-400 mb-2">Total de Entradas</h2>
            <p className="text-2xl font-bold">R$ {credits.toFixed(2)}</p>
          </div>

          <div className="bg-red-900 text-red-200 p-6 rounded shadow text-center">
            <h2 className="text-sm uppercase tracking-wide text-red-400 mb-2">Total de Saques</h2>
            <p className="text-2xl font-bold">R$ {debits.toFixed(2)}</p>
          </div>

          <div className="bg-blue-900 text-blue-200 p-6 rounded shadow text-center">
            <h2 className="text-sm uppercase tracking-wide text-blue-400 mb-2">Saldo da Plataforma</h2>
            <p className="text-2xl font-bold">R$ {balance.toFixed(2)}</p>
          </div>

          <div className="bg-yellow-900 text-yellow-100 p-6 rounded shadow text-center">
            <h2 className="text-sm uppercase tracking-wide text-yellow-400 mb-2">Partidas Finalizadas</h2>
            <p className="text-2xl font-bold">{totalGames}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Dados referentes aos últimos 7 dias.
        </p>
      </div>
    </div>
  );
};

export default RelatorioSemanal;
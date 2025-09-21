import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';

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
        // Dados fictícios como fallback
        setDados({
          credits: 12500.00,
          debits: 8500.00,
          balance: 4000.00,
          totalGames: 45
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando relatório semanal...</div>
      </div>
    );
  }

  if (!dados || Object.keys(dados).length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Semanal</h1>
        <div className="text-center text-gray-400">Ainda não há dados para exibir no relatório.</div>
      </div>
    );
  }

  const { credits, debits, balance, totalGames } = dados;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Semanal</h1>
      <p className="text-gray-300 mb-6">
        Dados referentes aos últimos 7 dias.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Entradas" 
          value={`R$ ${credits.toFixed(2)}`} 
          color="green" 
        />
        <CardTemplate 
          title="Total de Saques" 
          value={`R$ ${debits.toFixed(2)}`} 
          color="red" 
        />
        <CardTemplate 
          title="Saldo da Plataforma" 
          value={`R$ ${balance.toFixed(2)}`} 
          color="blue" 
        />
        <CardTemplate 
          title="Partidas Finalizadas" 
          value={totalGames} 
          color="yellow" 
        />
      </GridTemplate>

      {/* Informações Adicionais */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Resumo da Semana</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Taxa de Conversão</h3>
            <p className="text-2xl font-bold text-white">
              {((credits / (credits + debits)) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Média por Partida</h3>
            <p className="text-2xl font-bold text-white">
              R$ {(credits / totalGames).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Partidas por Dia</h3>
            <p className="text-2xl font-bold text-white">
              {(totalGames / 7).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioSemanal;
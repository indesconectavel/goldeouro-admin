import React, { useEffect, useState } from "react";
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const TopJogadores = () => {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopJogadores() {
      try {
        const result = await postData('/admin/top-jogadores', {});
        setJogadores(result || []);
      } catch (error) {
        console.error('Erro ao buscar top jogadores:', error);
        // DADOS ZERADOS PARA PRODUÇÃO
        setJogadores([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTopJogadores();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando ranking de jogadores..." />;
  }

  if (jogadores.length === 0) {
    return <EmptyState message="Ainda não há dados suficientes para o ranking de jogadores." />;
  }

  const totalJogadores = jogadores.length;
  const totalGols = jogadores.reduce((sum, jogador) => sum + jogador.totalGols, 0);
  const totalPartidas = jogadores.reduce((sum, jogador) => sum + jogador.totalPartidas, 0);
  const mediaEficiencia = jogadores.reduce((sum, jogador) => sum + jogador.eficiencia, 0) / jogadores.length;

  const tableColumns = [
    { key: 'posicao', header: '#' },
    { key: 'name', header: 'Jogador' },
    { key: 'totalGols', header: 'Gols' },
    { key: 'totalPartidas', header: 'Partidas' },
    { 
      key: 'eficiencia', 
      header: 'Eficiência',
      render: (jogador) => `${jogador.eficiencia.toFixed(1)}%`
    }
  ];

  // Adicionar posição aos dados
  const jogadoresComPosicao = jogadores.map((jogador, index) => ({
    ...jogador,
    posicao: index + 1
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Top Jogadores</h1>
      <p className="text-gray-300 mb-6">
        Ranking dos jogadores com melhor desempenho no Gol de Ouro.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Jogadores" 
          value={totalJogadores} 
          color="yellow" 
        />
        <CardTemplate 
          title="Total de Gols" 
          value={totalGols} 
          color="green" 
        />
        <CardTemplate 
          title="Total de Partidas" 
          value={totalPartidas} 
          color="blue" 
        />
        <CardTemplate 
          title="Média de Eficiência" 
          value={`${mediaEficiencia.toFixed(1)}%`} 
          color="purple" 
        />
      </GridTemplate>

      {/* Tabela de Ranking */}
      <TableTemplate 
        title="Ranking de Jogadores"
        columns={tableColumns}
        data={jogadoresComPosicao}
      />

      {/* Informações Adicionais */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do Ranking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Critério de Ranking:</span>
              <span className="text-white font-semibold">Eficiência (Gols/Partidas)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Período:</span>
              <span className="text-white font-semibold">Últimos 30 dias</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Atualização:</span>
              <span className="text-white font-semibold">Em tempo real</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="text-green-400 font-semibold">Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopJogadores;
import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const result = await postData('/admin/jogos', {});
        setGames(result || []);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        // Dados fictícios como fallback
        setGames([
          {
            id: 1,
            status: 'waiting',
            players: 0,
            maxPlayers: 2,
            betAmount: 50,
            createdAt: '2025-01-17T14:00:00Z',
            duration: 0
          },
          {
            id: 2,
            status: 'active',
            players: 2,
            maxPlayers: 2,
            betAmount: 100,
            createdAt: '2025-01-17T14:05:00Z',
            duration: 30
          },
          {
            id: 3,
            status: 'finished',
            players: 2,
            maxPlayers: 2,
            betAmount: 75,
            createdAt: '2025-01-17T13:30:00Z',
            duration: 120
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case 'waiting':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Aguardando</span>;
      case 'active':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Ativo</span>;
      case 'finished':
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Finalizado</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando jogos...</div>
      </div>
    );
  }

  const activeGames = games.filter(g => g.status === 'active').length;
  const waitingGames = games.filter(g => g.status === 'waiting').length;
  const finishedGames = games.filter(g => g.status === 'finished').length;
  const totalRevenue = games.reduce((total, game) => total + game.betAmount, 0);

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'status', 
      header: 'Status',
      render: (game) => getStatusBadge(game.status)
    },
    { 
      key: 'players', 
      header: 'Jogadores',
      render: (game) => `${game.players}/${game.maxPlayers}`
    },
    { 
      key: 'betAmount', 
      header: 'Valor da Aposta',
      render: (game) => `R$ ${game.betAmount.toFixed(2)}`
    },
    { 
      key: 'duration', 
      header: 'Duração',
      render: (game) => game.duration > 0 ? `${game.duration}s` : '-'
    },
    { 
      key: 'createdAt', 
      header: 'Criado em',
      render: (game) => new Date(game.createdAt).toLocaleString()
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Jogos</h1>
      <p className="text-gray-300 mb-6">
        Gerenciamento de jogos e partidas da plataforma.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Jogos Ativos" 
          value={activeGames} 
          color="green" 
        />
        <CardTemplate 
          title="Aguardando" 
          value={waitingGames} 
          color="yellow" 
        />
        <CardTemplate 
          title="Finalizados" 
          value={finishedGames} 
          color="white" 
        />
        <CardTemplate 
          title="Receita Total" 
          value={`R$ ${totalRevenue.toFixed(2)}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Tabela de Jogos */}
      <TableTemplate 
        title="Lista de Jogos"
        columns={tableColumns}
        data={games}
      />
    </div>
  );
};

export default Games;
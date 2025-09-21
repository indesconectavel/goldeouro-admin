import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Gamepad2, 
  Play, 
  Pause, 
  Square,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de jogos
    setTimeout(() => {
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
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary">Aguardando</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'finished':
        return <Badge variant="outline">Finalizado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jogos</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Iniciar Jogo
          </Button>
          <Button>
            <Gamepad2 className="w-4 h-4 mr-2" />
            Novo Jogo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Jogos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {games.filter(g => g.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Aguardando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {games.filter(g => g.status === 'waiting').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              R$ {games.reduce((total, game) => total + game.betAmount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Jogos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Jogadores</th>
                  <th className="text-left py-3 px-4">Valor da Aposta</th>
                  <th className="text-left py-3 px-4">Duração</th>
                  <th className="text-left py-3 px-4">Criado em</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">#{game.id}</td>
                    <td className="py-3 px-4">{getStatusBadge(game.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {game.players}/{game.maxPlayers}
                      </div>
                    </td>
                    <td className="py-3 px-4">R$ {game.betAmount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {game.duration > 0 ? `${game.duration}s` : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(game.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {game.status === 'waiting' && (
                          <Button size="sm" variant="outline">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {game.status === 'active' && (
                          <Button size="sm" variant="outline">
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Square className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Games;
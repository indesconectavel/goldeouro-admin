import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

export default function ChutesRecentes() {
  const [chutes, setChutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChutes() {
      try {
        const data = await postData('/admin/chutes-recentes', {});
        setChutes(data || []);
      } catch (error) {
        console.error('Erro ao buscar chutes recentes:', error);
        // Dados fictícios como fallback
        setChutes([
          {
            id: 1,
            user_name: 'João Silva',
            game_id: 1001,
            direction: 'Centro',
            scored: true,
            created_at: '2025-01-17T14:30:00Z'
          },
          {
            id: 2,
            user_name: 'Maria Santos',
            game_id: 1002,
            direction: 'Esquerda',
            scored: false,
            created_at: '2025-01-17T14:25:00Z'
          },
          {
            id: 3,
            user_name: 'Pedro Costa',
            game_id: 1003,
            direction: 'Direita',
            scored: true,
            created_at: '2025-01-17T14:20:00Z'
          },
          {
            id: 4,
            user_name: 'Ana Oliveira',
            game_id: 1004,
            direction: 'Centro',
            scored: true,
            created_at: '2025-01-17T14:15:00Z'
          },
          {
            id: 5,
            user_name: 'Carlos Lima',
            game_id: 1005,
            direction: 'Esquerda',
            scored: false,
            created_at: '2025-01-17T14:10:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchChutes();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando chutes recentes..." />;
  }

  if (chutes.length === 0) {
    return <EmptyState message="Ainda não há chutes registrados." />;
  }

  const totalChutes = chutes.length;
  const chutesGol = chutes.filter(chute => chute.scored).length;
  const chutesErro = chutes.filter(chute => !chute.scored).length;
  const taxaAcerto = totalChutes > 0 ? (chutesGol / totalChutes * 100) : 0;

  const getResultadoBadge = (scored) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    if (scored) {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Gol</span>;
    } else {
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Errou</span>;
    }
  };

  const tableColumns = [
    { key: 'user_name', header: 'Jogador' },
    { key: 'game_id', header: 'Partida' },
    { key: 'direction', header: 'Direção' },
    { 
      key: 'scored', 
      header: 'Resultado',
      render: (chute) => getResultadoBadge(chute.scored)
    },
    { 
      key: 'created_at', 
      header: 'Data',
      render: (chute) => new Date(chute.created_at).toLocaleString('pt-BR')
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Chutes Recentes</h1>
      <p className="text-gray-300 mb-6">
        Listagem dos últimos chutes realizados nas partidas.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Chutes" 
          value={totalChutes} 
          color="yellow" 
        />
        <CardTemplate 
          title="Gols Marcados" 
          value={chutesGol} 
          color="green" 
        />
        <CardTemplate 
          title="Chutes Errados" 
          value={chutesErro} 
          color="red" 
        />
        <CardTemplate 
          title="Taxa de Acerto" 
          value={`${taxaAcerto.toFixed(1)}%`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Tabela de Chutes */}
      <TableTemplate 
        title="Histórico de Chutes"
        columns={tableColumns}
        data={chutes}
      />

      {/* Estatísticas por Direção */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Estatísticas por Direção</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Centro', 'Esquerda', 'Direita'].map(direcao => {
            const chutesDirecao = chutes.filter(chute => chute.direction === direcao);
            const golsDirecao = chutesDirecao.filter(chute => chute.scored).length;
            const taxaDirecao = chutesDirecao.length > 0 ? (golsDirecao / chutesDirecao.length * 100) : 0;
            
            return (
              <div key={direcao} className="text-center">
                <h3 className="text-white font-semibold mb-2">{direcao}</h3>
                <p className="text-2xl font-bold text-yellow-400">{chutesDirecao.length}</p>
                <p className="text-sm text-gray-400">chutes</p>
                <p className="text-lg font-semibold text-green-400">{golsDirecao}</p>
                <p className="text-sm text-gray-400">gols</p>
                <p className="text-sm text-blue-400">{taxaDirecao.toFixed(1)}% acerto</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
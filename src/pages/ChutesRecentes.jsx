import { useEffect, useState } from 'react';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';

export default function ChutesRecentes() {
  const [chutes, setChutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchChutes() {
      setLoading(true);
      setError('');
      try {
        const result = await getData('/api/admin/chutes/recentes?limit=50');
        if (!result?.success || !result?.data?.items) {
          throw new Error(result?.message || 'Resposta inválida');
        }
        setChutes(Array.isArray(result.data.items) ? result.data.items : []);
      } catch (e) {
        console.error('Erro ao buscar chutes recentes:', e);
        setChutes([]);
        setError(e?.message || 'Não foi possível carregar os chutes recentes.');
      } finally {
        setLoading(false);
      }
    }

    void fetchChutes();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando chutes recentes..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">Chutes recentes</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
      </div>
    );
  }

  if (chutes.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">Chutes recentes</h1>
        <p className="text-gray-400">Nenhum chute encontrado.</p>
      </div>
    );
  }

  const totalChutes = chutes.length;
  const chutesGol = chutes.filter((c) => c.scored).length;
  const chutesErro = totalChutes - chutesGol;
  const taxaAcerto = totalChutes > 0 ? (chutesGol / totalChutes) * 100 : 0;

  const getResultadoBadge = (scored) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold';
    if (scored) {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Prêmio &gt; 0</span>;
    }
    return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Sem prêmio</span>;
  };

  const tableColumns = [
    { key: 'user_name', header: 'Jogador' },
    { key: 'game_id', header: 'Lote / ref.' },
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
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Chutes recentes</h1>
      <p className="text-gray-400 text-sm mb-4">
        Fonte: <code className="text-yellow-200/90">GET /api/admin/chutes/recentes</code> (últimos registros globais).
      </p>

      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate title="Total de chutes" value={totalChutes} color="yellow" />
        <CardTemplate title="Com prêmio &gt; 0" value={chutesGol} color="green" />
        <CardTemplate title="Sem prêmio" value={chutesErro} color="red" />
        <CardTemplate title="Taxa (prêmio/total)" value={`${taxaAcerto.toFixed(1)}%`} color="blue" />
      </GridTemplate>

      <TableTemplate title="Histórico de chutes" columns={tableColumns} data={chutes} />

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Por direção</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Centro', 'Esquerda', 'Direita'].map((direcao) => {
            const chutesDirecao = chutes.filter((c) => {
              const d = String(c.direction || '').toLowerCase();
              return d === direcao.toLowerCase() || d.includes(direcao.toLowerCase());
            });
            const golsDirecao = chutesDirecao.filter((c) => c.scored).length;
            const taxaDirecao = chutesDirecao.length > 0 ? (golsDirecao / chutesDirecao.length) * 100 : 0;
            return (
              <div key={direcao} className="text-center">
                <h3 className="text-white font-semibold mb-2">{direcao}</h3>
                <p className="text-2xl font-bold text-yellow-400">{chutesDirecao.length}</p>
                <p className="text-sm text-gray-400">chutes</p>
                <p className="text-lg font-semibold text-green-400">{golsDirecao}</p>
                <p className="text-sm text-gray-400">com prêmio</p>
                <p className="text-sm text-blue-400">{taxaDirecao.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

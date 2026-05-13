import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const RelatorioPorUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      setError('');
      setUsuario(null);
      if (!id || String(id).trim() === '') {
        setError('Identificador de usuário ausente na URL.');
        setLoading(false);
        return;
      }
      try {
        const result = await getData(`/api/admin/users/${encodeURIComponent(String(id).trim())}`);
        if (!result?.success || !result?.data) {
          throw new Error(result?.message || 'Falha ao carregar dados do usuário');
        }
        setUsuario(result.data);
      } catch (e) {
        console.error('Erro ao buscar dados do usuário:', e);
        setError(e?.message || 'Não foi possível carregar o relatório deste usuário.');
      } finally {
        setLoading(false);
      }
    };

    void fetchUsuario();
  }, [id]);

  if (loading) {
    return <StandardLoader message="Carregando dados do usuário..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório individual</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
        <Link to="/lista-usuarios" className="text-yellow-300 hover:underline">
          ← Voltar à lista de usuários
        </Link>
      </div>
    );
  }

  if (!usuario) {
    return <EmptyState message="Usuário não encontrado ou sem dados disponíveis." />;
  }

  const nome = usuario.nome || usuario.email || '—';
  const saldo = Number.isFinite(Number(usuario.saldo)) ? Number(usuario.saldo) : 0;
  const chutes = usuario.activity?.total_chutes;
  const gols = usuario.activity?.total_gols;
  const eficiencia =
    typeof chutes === 'number' && chutes > 0 && typeof gols === 'number'
      ? ((gols / chutes) * 100).toFixed(1)
      : null;

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold';
    if (status === 'blocked') {
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Bloqueado</span>;
    }
    return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Ativo</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório individual</h1>
        <Link
          to="/lista-usuarios"
          className="text-sm text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
        >
          ← Voltar à lista de usuários
        </Link>
      </div>

      <p className="text-gray-300 text-sm">
        Dados reais via <code className="text-yellow-200/90">GET /api/admin/users/:id</code>. Métricas de chutes
        são agregações de leitura (contagem na tabela de chutes).
      </p>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do usuário</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Nome</p>
            <h3 className="text-lg font-bold text-white">{nome}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">E-mail</p>
            <h3 className="text-lg font-bold text-white">{usuario.email || '—'}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <div className="mt-1">{getStatusBadge(usuario.account_status)}</div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Criado em</p>
            <h3 className="text-lg font-bold text-white">
              {usuario.created_at ? new Date(usuario.created_at).toLocaleString('pt-BR') : '—'}
            </h3>
          </div>
        </div>
      </div>

      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate title="Total de chutes (registros)" value={chutes != null ? chutes : '—'} color="blue" />
        <CardTemplate title="Chutes com prêmio &gt; 0" value={gols != null ? gols : '—'} color="green" />
        <CardTemplate title="Eficiência (aprox.)" value={eficiencia != null ? `${eficiencia}%` : '—'} color="purple" />
        <CardTemplate
          title="Saldo atual"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}
          color="yellow"
        />
      </GridTemplate>

      <div className="card p-6 text-sm text-gray-400">
        <p>
          Não são exibidos totais financeiros agregados de crédito/débito nesta tela (não há endpoint dedicado na V1).
          Use o <Link to="/relatorio-financeiro" className="text-yellow-300 underline">relatório financeiro</Link> para
          movimentações recentes do ledger.
        </p>
      </div>
    </div>
  );
};

export default RelatorioPorUsuario;

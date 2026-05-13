import React, { useEffect, useState, useCallback } from 'react';
import { getData, postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const UsuariosBloqueados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState({ message: '', type: '' });
  const [rowBusy, setRowBusy] = useState(null);

  const fetchBloqueados = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getData('/api/admin/users/list?status=blocked&limit=200');
      if (!result?.success) {
        throw new Error(result?.message || 'Falha ao listar usuários bloqueados');
      }
      setUsuarios(Array.isArray(result.data) ? result.data : []);
    } catch (e) {
      console.error('Erro ao buscar usuários bloqueados:', e);
      setUsuarios([]);
      setError(e?.message || 'Erro ao carregar a lista.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBloqueados();
  }, [fetchBloqueados]);

  const desbloquearUsuario = async (u) => {
    if (!window.confirm(`Desbloquear "${u.email || u.nome || u.id}"?`)) return;
    setRowBusy(u.id);
    setActionStatus({ message: '', type: '' });
    try {
      const result = await postData('/api/admin/users/unblock', { userId: u.id });
      if (!result?.success) {
        throw new Error(result?.message || 'Falha ao desbloquear');
      }
      setActionStatus({ message: 'Usuário desbloqueado.', type: 'success' });
      await fetchBloqueados();
    } catch (e) {
      console.error(e);
      setActionStatus({ message: e?.message || 'Erro ao desbloquear', type: 'error' });
    } finally {
      setRowBusy(null);
      setTimeout(() => setActionStatus({ message: '', type: '' }), 4000);
    }
  };

  if (loading) {
    return <StandardLoader message="Carregando usuários bloqueados..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">Usuários bloqueados</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return <EmptyState message="Nenhum usuário bloqueado no momento." />;
  }

  const totalBloqueados = usuarios.length;
  const bloqueadosHoje = usuarios.filter((u) => {
    if (!u.blocked_at) return false;
    return new Date(u.blocked_at).toDateString() === new Date().toDateString();
  }).length;
  const bloqueadosSemana = usuarios.filter((u) => {
    if (!u.blocked_at) return false;
    const blockedDate = new Date(u.blocked_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return blockedDate >= weekAgo;
  }).length;

  const tableColumns = [
    {
      key: 'nome',
      header: 'Nome',
      render: (u) => u.nome || '—'
    },
    { key: 'email', header: 'E-mail' },
    {
      key: 'blocked_at',
      header: 'Bloqueado em',
      render: (u) => (u.blocked_at ? new Date(u.blocked_at).toLocaleString('pt-BR') : '—')
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (u) => (
        <button
          type="button"
          disabled={rowBusy === u.id}
          onClick={() => void desbloquearUsuario(u)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
        >
          {rowBusy === u.id ? 'Aguarde…' : 'Desbloquear'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Usuários bloqueados</h1>
      <p className="text-gray-400 text-sm mb-4">
        Fonte: <code className="text-yellow-200/90">GET /api/admin/users/list?status=blocked</code>. Desbloqueio:{' '}
        <code className="text-yellow-200/90">POST /api/admin/users/unblock</code>.
      </p>

      {actionStatus.message ? (
        <div
          className={`p-3 rounded-md text-white ${
            actionStatus.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {actionStatus.message}
        </div>
      ) : null}

      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate title="Total bloqueados" value={totalBloqueados} color="red" />
        <CardTemplate title="Bloqueados hoje" value={bloqueadosHoje} color="orange" />
        <CardTemplate title="Bloqueados (7 dias)" value={bloqueadosSemana} color="yellow" />
      </GridTemplate>

      <TableTemplate title="Lista" columns={tableColumns} data={usuarios} />
    </div>
  );
};

export default UsuariosBloqueados;

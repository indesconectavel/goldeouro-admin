import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getData, postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const isAdminTipo = (u) => String(u?.tipo || '').toLowerCase() === 'admin';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [listVersion, setListVersion] = useState(0);
  const [rowActionId, setRowActionId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
      }
      if (statusFilter && statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      const result = await getData(`/api/admin/users/list?${params.toString()}`);
      if (!result?.success) {
        throw new Error(result?.message || 'Falha ao listar usuários');
      }
      setUsers(Array.isArray(result.data) ? result.data : []);
      setMeta(result.meta ?? null);
    } catch (e) {
      console.error('Erro ao buscar usuários:', e);
      setError(e?.message || 'Erro ao carregar usuários');
      setUsers([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const delayMs = searchTerm.trim() ? 400 : 0;
    const handle = setTimeout(() => {
      void loadUsers();
    }, delayMs);
    return () => clearTimeout(handle);
  }, [searchTerm, statusFilter, listVersion, loadUsers]);

  const bumpList = () => setListVersion((v) => v + 1);

  const handleBlock = async (u) => {
    if (isAdminTipo(u)) return;
    if (!window.confirm(`Bloquear o acesso de "${u.email || u.nome || u.id}"?`)) return;
    const reasonRaw = window.prompt('Motivo do bloqueio (opcional):', '');
    const payload = { userId: u.id };
    if (reasonRaw != null && String(reasonRaw).trim() !== '') {
      payload.reason = String(reasonRaw).trim();
    }
    setRowActionId(u.id);
    setError('');
    try {
      const result = await postData('/api/admin/users/block', payload);
      if (!result?.success) {
        throw new Error(result?.message || 'Falha ao bloquear usuário');
      }
      bumpList();
    } catch (e) {
      console.error('Erro ao bloquear:', e);
      setError(e?.message || 'Erro ao bloquear usuário');
    } finally {
      setRowActionId(null);
    }
  };

  const handleUnblock = async (u) => {
    if (!window.confirm(`Desbloquear o acesso de "${u.email || u.nome || u.id}"?`)) return;
    const reasonRaw = window.prompt('Motivo do desbloqueio (opcional):', '');
    const payload = { userId: u.id };
    if (reasonRaw != null && String(reasonRaw).trim() !== '') {
      payload.reason = String(reasonRaw).trim();
    }
    setRowActionId(u.id);
    setError('');
    try {
      const result = await postData('/api/admin/users/unblock', payload);
      if (!result?.success) {
        throw new Error(result?.message || 'Falha ao desbloquear usuário');
      }
      bumpList();
    } catch (e) {
      console.error('Erro ao desbloquear:', e);
      setError(e?.message || 'Erro ao desbloquear usuário');
    } finally {
      setRowActionId(null);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold';
    switch (status) {
      case 'active':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Ativo</span>;
      case 'blocked':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Bloqueado</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>—</span>;
    }
  };

  const formatCurrency = (value) => {
    const n = Number(value);
    const safe = Number.isFinite(n) ? n : 0;
    return `R$ ${safe.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('pt-BR');
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.account_status === 'active').length;
  const blockedUsers = users.filter((u) => u.account_status === 'blocked').length;
  const totalBalance = users.reduce((sum, u) => sum + (Number.isFinite(Number(u.saldo)) ? Number(u.saldo) : 0), 0);

  const tableColumns = [
    {
      key: 'nome',
      header: 'Nome',
      render: (u) => u.nome || '—'
    },
    { key: 'email', header: 'Email' },
    {
      key: 'saldo',
      header: 'Saldo',
      render: (u) => formatCurrency(u.saldo)
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (u) => (u.tipo != null ? String(u.tipo) : '—')
    },
    {
      key: 'account_status',
      header: 'Status',
      render: (u) => getStatusBadge(u.account_status)
    },
    {
      key: 'blocked_at',
      header: 'Bloqueado em',
      render: (u) => formatDate(u.blocked_at)
    },
    {
      key: 'created_at',
      header: 'Criado em',
      render: (u) => formatDate(u.created_at)
    },
    {
      key: 'relatorio',
      header: 'Relatório',
      render: (u) => (
        <Link
          to={`/relatorio-por-usuario/${encodeURIComponent(String(u.id))}`}
          className="text-yellow-300 hover:text-yellow-200 text-xs font-semibold underline"
        >
          Ver
        </Link>
      )
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (u) => {
        if (rowActionId === u.id) {
          return <span className="text-yellow-400 text-xs">Aguarde…</span>;
        }
        if (isAdminTipo(u)) {
          if (u.account_status === 'blocked') {
            return (
              <button
                type="button"
                onClick={() => void handleUnblock(u)}
                className="px-3 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold"
              >
                Desbloquear
              </button>
            );
          }
          return <span className="text-gray-500 text-xs">—</span>;
        }
        if (u.account_status === 'active') {
          return (
            <button
              type="button"
              onClick={() => void handleBlock(u)}
              className="px-3 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold"
            >
              Bloquear
            </button>
          );
        }
        return (
          <button
            type="button"
            onClick={() => void handleUnblock(u)}
            className="px-3 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold"
          >
            Desbloquear
          </button>
        );
      }
    }
  ];

  const showInitialSpinner = loading && users.length === 0 && !error;

  if (showInitialSpinner) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Usuários</h1>
      <p className="text-gray-300 mb-2">Gerenciamento de usuários da plataforma.</p>
      <p className="text-xs text-gray-500 mb-6">
        Os totais dos cards refletem apenas os registros desta listagem (até {meta?.limit ?? 50} por
        requisição).
      </p>

      {error ? (
        <div className="text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">
          {error}
        </div>
      ) : null}

      {loading && users.length > 0 ? (
        <div className="text-center text-yellow-400 text-sm">Atualizando lista...</div>
      ) : null}

      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate title="Total (página)" value={totalUsers} color="yellow" />
        <CardTemplate title="Ativos (página)" value={activeUsers} color="green" />
        <CardTemplate title="Bloqueados (página)" value={blockedUsers} color="red" />
        <CardTemplate title="Saldo total (página)" value={formatCurrency(totalBalance)} color="blue" />
      </GridTemplate>

      <div className="card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Buscar (email ou nome)</label>
            <input
              type="text"
              placeholder="Digite e aguarde a busca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs text-gray-400 mb-1">Status da conta</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
        </div>
      </div>

      {!loading && !error && users.length === 0 ? (
        <div className="text-center text-gray-400 py-8 border border-zinc-700 rounded">
          Nenhum usuário encontrado para os filtros atuais.
        </div>
      ) : null}

      {!error && users.length > 0 ? (
        <TableTemplate title="Lista de Usuários" columns={tableColumns} data={users} />
      ) : null}
    </div>
  );
};

export default Users;

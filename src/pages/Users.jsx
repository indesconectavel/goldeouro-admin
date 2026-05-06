import React, { useEffect, useState } from 'react';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const delayMs = searchTerm.trim() ? 400 : 0;
    const handle = setTimeout(() => {
      void (async () => {
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
      })();
    }, delayMs);
    return () => clearTimeout(handle);
  }, [searchTerm, statusFilter]);

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
      key: 'created_at',
      header: 'Criado em',
      render: (u) => formatDate(u.created_at)
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

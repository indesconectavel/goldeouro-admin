import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const RelatorioUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await getData('/api/admin/users/list?limit=200');
        if (!result?.success) {
          throw new Error(result?.message || 'Falha ao carregar usuários');
        }
        setUsuarios(Array.isArray(result.data) ? result.data : []);
      } catch (e) {
        console.error('Erro ao buscar relatório de usuários:', e);
        setUsuarios([]);
        setError(e?.message || 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    void fetchUsuarios();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando relatório de usuários..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório de usuários</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return <EmptyState message="Nenhum usuário retornado para os parâmetros atuais." />;
  }

  const totalUsuarios = usuarios.length;
  const saldoTotal = usuarios.reduce((sum, u) => sum + (Number.isFinite(Number(u.saldo)) ? Number(u.saldo) : 0), 0);

  const tableColumns = [
    {
      key: 'nome',
      header: 'Nome',
      render: (usuario) => (
        <Link
          to={`/relatorio-por-usuario/${encodeURIComponent(String(usuario.id))}`}
          className="text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
        >
          {usuario.nome || usuario.email || '—'}
        </Link>
      )
    },
    { key: 'email', header: 'E-mail' },
    {
      key: 'saldo',
      header: 'Saldo (R$)',
      render: (usuario) => (
        <span className="text-white font-bold">
          R$ {(Number(usuario.saldo) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      key: 'account_status',
      header: 'Status',
      render: (u) => (u.account_status === 'blocked' ? 'Bloqueado' : 'Ativo')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório de usuários</h1>
      </div>

      <p className="text-gray-300 text-sm">
        Lista real (até 200 registros) via <code className="text-yellow-200/90">GET /api/admin/users/list</code>.
        Clique no nome para o relatório individual.
      </p>

      <GridTemplate cols={{ sm: 2, lg: 2 }}>
        <CardTemplate title="Usuários na amostra" value={totalUsuarios} color="yellow" />
        <CardTemplate
          title="Soma dos saldos (amostra)"
          value={`R$ ${saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          color="blue"
        />
      </GridTemplate>

      <TableTemplate title="Usuários" columns={tableColumns} data={usuarios} />
    </div>
  );
};

export default RelatorioUsuarios;

import React, { useEffect, useState } from 'react';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const tipoLabel = (tipo) => String(tipo || '—');

const Transacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTransacoes() {
      setLoading(true);
      setError('');
      try {
        const result = await getData('/api/admin/financial/report');
        if (!result?.success || !result?.data) {
          throw new Error(result?.message || 'Falha ao carregar relatório financeiro');
        }
        const recent = Array.isArray(result.data.transacoes_recentes) ? result.data.transacoes_recentes : [];
        const mapped = recent.map((row) => {
          const tipo = String(row.tipo || '').toLowerCase();
          const isCredit = tipo === 'deposito' || tipo === 'credito' || tipo === 'bonus';
          return {
            id: row.id,
            user_id: '—',
            type: isCredit ? 'credit' : 'debit',
            amount: Math.abs(Number(row.valor) || 0),
            description: tipoLabel(row.tipo),
            transaction_date: row.created_at
          };
        });
        setTransacoes(mapped);
      } catch (e) {
        console.error('Erro ao buscar transações:', e);
        setTransacoes([]);
        setError(e?.message || 'Não foi possível carregar as movimentações recentes do ledger.');
      } finally {
        setLoading(false);
      }
    }

    void fetchTransacoes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando transações...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Transações</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
        <p className="text-gray-400 text-sm">
          Fonte esperada: <code className="text-yellow-200/90">GET /api/admin/financial/report</code> (campo{' '}
          <code>transacoes_recentes</code>).
        </p>
      </div>
    );
  }

  const totalCreditos = transacoes.filter((t) => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebitos = transacoes.filter((t) => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const saldoLiquido = totalCreditos - totalDebitos;
  const totalTransacoes = transacoes.length;

  const getTipoBadge = (tipo) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold';
    return tipo === 'credit' ? (
      <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Crédito</span>
    ) : (
      <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Débito</span>
    );
  };

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'user_id', header: 'Usuário' },
    {
      key: 'type',
      header: 'Tipo',
      render: (t) => getTipoBadge(t.type)
    },
    {
      key: 'amount',
      header: 'Valor',
      render: (t) => `R$ ${Number(t.amount).toFixed(2)}`
    },
    {
      key: 'description',
      header: 'Tipo (ledger)',
      render: (t) => t.description || '-'
    },
    {
      key: 'transaction_date',
      header: 'Data',
      render: (t) => (t.transaction_date ? new Date(t.transaction_date).toLocaleString('pt-BR') : '—')
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Transações recentes</h1>
      <p className="text-gray-400 text-sm mb-4">
        Lista derivada do relatório financeiro (últimas linhas do ledger). Não inclui identificação de usuário final
        nesta visão.
      </p>

      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate title="Total de linhas" value={totalTransacoes} color="yellow" />
        <CardTemplate title="Soma créditos (aprox.)" value={`R$ ${totalCreditos.toFixed(2)}`} color="green" />
        <CardTemplate title="Soma débitos (aprox.)" value={`R$ ${totalDebitos.toFixed(2)}`} color="red" />
        <CardTemplate title="Saldo parcial (lista)" value={`R$ ${saldoLiquido.toFixed(2)}`} color="blue" />
      </GridTemplate>

      {transacoes.length === 0 ? (
        <p className="text-gray-400">Nenhuma transação recente retornada.</p>
      ) : (
        <TableTemplate title="Ledger (amostra)" columns={tableColumns} data={transacoes} />
      )}
    </div>
  );
};

export default Transacoes;

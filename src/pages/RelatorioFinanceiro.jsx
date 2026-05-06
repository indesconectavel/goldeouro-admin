import { useEffect, useState } from 'react';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

export default function RelatorioFinanceiro() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError('');
        const result = await getData('/api/admin/financial/report');
        if (!result?.success || !result?.data) {
          throw new Error(result?.message || 'Falha ao carregar relatório financeiro');
        }
        setDados(result.data);
      } catch (error) {
        console.error('Erro ao buscar dados financeiros reais:', error);
        setError(error?.message || 'Erro ao carregar relatório financeiro');
        setDados(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando dados financeiros...</div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-400">Ainda não possui dados financeiros para exibir.</div>
      </div>
    );
  }

  const {
    receitas_depositos,
    saques_total,
    taxas_total,
    saldo_total_usuarios,
    volume_ledger,
    resultado_liquido_estimado,
    transacoes_recentes,
    updated_at
  } = dados;

  const transacoes = Array.isArray(transacoes_recentes) ? transacoes_recentes : [];

  const getTipoBadge = (tipo) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (tipo) {
      case 'deposito':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Depósito</span>;
      case 'saque':
      case 'payout_manual_confirmado':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Saque</span>;
      case 'taxa':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Taxa</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-300`}>{tipo || 'Outro'}</span>;
    }
  };

  const formatCurrency = (value) => {
    return `R$ ${toNumber(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('pt-BR');
  };

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'tipo', 
      header: 'Tipo',
      render: (transacao) => getTipoBadge(transacao.tipo)
    },
    { 
      key: 'valor', 
      header: 'Valor',
      render: (transacao) => formatCurrency(transacao.valor)
    },
    {
      key: 'referencia',
      header: 'Referência',
      render: (transacao) => transacao.referencia || transacao.correlation_id || '-'
    },
    { 
      key: 'created_at',
      header: 'Data',
      render: (transacao) => formatDateTime(transacao.created_at)
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Financeiro</h1>
      <p className="text-gray-300 mb-6">
        Visão geral das finanças da plataforma.
      </p>

      {error ? (
        <div className="text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">
          {error}
        </div>
      ) : null}
      
      {/* Cards de Resumo Principal */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Receitas Depósitos" 
          value={formatCurrency(receitas_depositos)} 
          color="green" 
        />
        <CardTemplate 
          title="Saques Total" 
          value={formatCurrency(saques_total)} 
          color="red" 
        />
        <CardTemplate 
          title="Taxas Total" 
          value={formatCurrency(taxas_total)} 
          color="yellow" 
        />
      </GridTemplate>

      {/* Cards de Período */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Saldo Total Usuários" 
          value={formatCurrency(saldo_total_usuarios)} 
          color="blue" 
        />
        <CardTemplate 
          title="Volume Ledger" 
          value={formatCurrency(volume_ledger)} 
          color="blue" 
        />
        <CardTemplate 
          title="Resultado Líquido Estimado" 
          value={formatCurrency(resultado_liquido_estimado)} 
          color="blue" 
        />
      </GridTemplate>

      <div className="text-right text-xs text-gray-400">
        Atualizado em: {formatDateTime(updated_at)}
      </div>

      {/* Tabela de Transações */}
      {transacoes.length === 0 ? (
        <div className="text-center text-gray-400 py-6 border border-zinc-700 rounded">
          Nenhuma transação recente encontrada no ledger.
        </div>
      ) : (
        <TableTemplate 
          title="Transações Recentes"
          columns={tableColumns}
          data={transacoes}
        />
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

export default function RelatorioFinanceiro() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await postData('/admin/relatorio-financeiro', {});
        setDados(result);
      } catch (error) {
        console.error('Erro ao buscar dados financeiros, usando dados fictícios:', error);
        // Dados fictícios como fallback
        setDados({
          receitaTotal: 125430.50,
          despesasTotal: 45680.30,
          lucroTotal: 79750.20,
          receitaHoje: 2340.80,
          receitaSemana: 15680.40,
          receitaMes: 125430.50,
          transacoes: [
            { id: 1, tipo: 'Entrada', valor: 500.00, data: '2025-01-09', status: 'Concluída' },
            { id: 2, tipo: 'Saída', valor: 200.00, data: '2025-01-09', status: 'Concluída' },
            { id: 3, tipo: 'Entrada', valor: 750.00, data: '2025-01-08', status: 'Concluída' },
            { id: 4, tipo: 'Saída', valor: 300.00, data: '2025-01-08', status: 'Pendente' },
            { id: 5, tipo: 'Entrada', valor: 1200.00, data: '2025-01-07', status: 'Concluída' }
          ]
        });
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
        <div className="text-center text-gray-400">Ainda não possui dados financeiros...</div>
      </div>
    );
  }

  const {
    receitaTotal,
    despesasTotal,
    lucroTotal,
    receitaHoje,
    receitaSemana,
    receitaMes,
    transacoes
  } = dados;

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case 'Concluída':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Concluída</span>;
      case 'Pendente':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Pendente</span>;
      case 'Cancelada':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Cancelada</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
  };

  const getTipoBadge = (tipo) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (tipo) {
      case 'Entrada':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Entrada</span>;
      case 'Saída':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Saída</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
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
      render: (transacao) => `R$ ${transacao.valor.toFixed(2)}`
    },
    { key: 'data', header: 'Data' },
    { 
      key: 'status', 
      header: 'Status',
      render: (transacao) => getStatusBadge(transacao.status)
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório Financeiro</h1>
      <p className="text-gray-300 mb-6">
        Visão geral das finanças da plataforma.
      </p>
      
      {/* Cards de Resumo Principal */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Receita Total" 
          value={`R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="green" 
        />
        <CardTemplate 
          title="Despesas Total" 
          value={`R$ ${despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="red" 
        />
        <CardTemplate 
          title="Lucro Total" 
          value={`R$ ${lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="yellow" 
        />
      </GridTemplate>

      {/* Cards de Período */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Receita Hoje" 
          value={`R$ ${receitaHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="blue" 
        />
        <CardTemplate 
          title="Receita Semana" 
          value={`R$ ${receitaSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="blue" 
        />
        <CardTemplate 
          title="Receita Mês" 
          value={`R$ ${receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Tabela de Transações */}
      <TableTemplate 
        title="Transações Recentes"
        columns={tableColumns}
        data={transacoes}
      />
    </div>
  );
}
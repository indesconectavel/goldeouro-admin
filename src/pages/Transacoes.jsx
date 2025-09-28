import React, { useEffect, useState } from "react";
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const Transacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransacoes() {
      try {
        const result = await postData("/admin/transacoes-recentes", {});
        setTransacoes(result || []);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        // Dados fictícios como fallback
        setTransacoes([
          {
            id: 1,
            user_id: 'Usuário',
            type: 'credit',
            amount: 100.00,
            description: 'Depósito via PIX',
            transaction_date: '2025-01-17T14:30:00Z'
          },
          {
            id: 2,
            user_id: 'Usuário',
            type: 'debit',
            amount: 50.00,
            description: 'Aposta em jogo',
            transaction_date: '2025-01-17T14:25:00Z'
          },
          {
            id: 3,
            user_id: 'Usuário',
            type: 'credit',
            amount: 200.00,
            description: 'Ganho em jogo',
            transaction_date: '2025-01-17T14:20:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransacoes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando transações...</div>
      </div>
    );
  }

  const totalCreditos = transacoes
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalDebitos = transacoes
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const saldoLiquido = totalCreditos - totalDebitos;
  const totalTransacoes = transacoes.length;

  const getTipoBadge = (tipo) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    return tipo === 'credit' 
      ? <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Crédito</span>
      : <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Débito</span>;
  };

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'user_id', header: 'Usuário' },
    { 
      key: 'type', 
      header: 'Tipo',
      render: (transacao) => getTipoBadge(transacao.type)
    },
    { 
      key: 'amount', 
      header: 'Valor',
      render: (transacao) => `R$ ${parseFloat(transacao.amount).toFixed(2)}`
    },
    { 
      key: 'description', 
      header: 'Descrição',
      render: (transacao) => transacao.description || '-'
    },
    { 
      key: 'transaction_date', 
      header: 'Data',
      render: (transacao) => new Date(transacao.transaction_date).toLocaleDateString("pt-BR")
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Transações</h1>
      <p className="text-gray-300 mb-6">
        Histórico de créditos, débitos e movimentações da plataforma.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Transações" 
          value={totalTransacoes} 
          color="yellow" 
        />
        <CardTemplate 
          title="Total Créditos" 
          value={`R$ ${totalCreditos.toFixed(2)}`} 
          color="green" 
        />
        <CardTemplate 
          title="Total Débitos" 
          value={`R$ ${totalDebitos.toFixed(2)}`} 
          color="red" 
        />
        <CardTemplate 
          title="Saldo Líquido" 
          value={`R$ ${saldoLiquido.toFixed(2)}`} 
          color={saldoLiquido >= 0 ? "green" : "red"} 
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
};

export default Transacoes;
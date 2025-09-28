import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const SaqueUsuarios = () => {
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaques() {
      try {
        const result = await postData('/admin/relatorio-saques', {});
        setSaques(result || []);
      } catch (error) {
        console.error('Erro ao buscar saques:', error);
        // Dados fictícios como fallback
        setSaques([
          {
            id: 1,
            user_id: 'Usuário',
            amount: 150.00,
            status: 'aprovado',
            created_at: '2025-01-17T14:00:00Z'
          },
          {
            id: 2,
            user_id: 'Usuário',
            amount: 75.50,
            status: 'pendente',
            created_at: '2025-01-17T13:30:00Z'
          },
          {
            id: 3,
            user_id: 'Usuário',
            amount: 200.00,
            status: 'rejeitado',
            created_at: '2025-01-17T13:00:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchSaques();
  }, []);

  const exportarCSV = () => {
    const url = import.meta.env.VITE_API_URL + '/admin/exportar/saques-csv';
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando relatório de saques...</div>
      </div>
    );
  }

  const totalSaques = saques.length;
  const saquesAprovados = saques.filter(s => s.status === 'aprovado').length;
  const saquesPendentes = saques.filter(s => s.status === 'pendente').length;
  const valorTotal = saques.reduce((sum, saque) => sum + saque.amount, 0);

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case 'aprovado':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Aprovado</span>;
      case 'pendente':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Pendente</span>;
      case 'rejeitado':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Rejeitado</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
  };

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'user_id', header: 'Usuário' },
    { 
      key: 'amount', 
      header: 'Valor',
      render: (saque) => `R$ ${saque.amount.toFixed(2)}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (saque) => getStatusBadge(saque.status)
    },
    { 
      key: 'created_at', 
      header: 'Data',
      render: (saque) => new Date(saque.created_at).toLocaleDateString("pt-BR")
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório de Saques</h1>
        <button
          onClick={exportarCSV}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Saques" 
          value={totalSaques} 
          color="yellow" 
        />
        <CardTemplate 
          title="Aprovados" 
          value={saquesAprovados} 
          color="green" 
        />
        <CardTemplate 
          title="Pendentes" 
          value={saquesPendentes} 
          color="yellow" 
        />
        <CardTemplate 
          title="Valor Total" 
          value={`R$ ${valorTotal.toFixed(2)}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Tabela de Saques */}
      <TableTemplate 
        title="Lista de Saques"
        columns={tableColumns}
        data={saques}
      />
    </div>
  );
};

export default SaqueUsuarios;
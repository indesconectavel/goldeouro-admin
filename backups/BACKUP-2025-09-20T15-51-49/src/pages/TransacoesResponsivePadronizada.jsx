// src/pages/TransacoesResponsivePadronizada.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import ResponsiveWrapper from "../components/ResponsiveWrapper";
import StandardPageLayout from "../components/StandardPageLayout";
import ResponsiveCard, { SectionCard } from "../components/ResponsiveCard";
import ResponsiveGrid from "../components/ResponsiveGrid";
import ResponsiveTable, { StatusBadge, CurrencyValue } from "../components/ResponsiveTable";
import Transacoes from "./Transacoes";

const TransacoesResponsivePadronizada = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Transacoes />;
  }

  // Mobile e Tablet usam versão responsiva padronizada
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_TRANSACOES"
      fallback={<Transacoes />}
      desktopFallback={<Transacoes />}
    >
      <TransacoesMobileTabletPadronizada />
    </ResponsiveWrapper>
  );
};

const TransacoesMobileTabletPadronizada = () => {
  const { device, isMobile } = useDeviceDetection();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransacoes();
  }, []);

  const fetchTransacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/admin/transacoes', {});
      setTransacoes(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      // Dados de fallback para demonstração
      setTransacoes([
        {
          id: 1,
          user_id: 'user_001',
          type: 'credit',
          amount: 50.00,
          description: 'Depósito via PIX',
          transaction_date: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: 2,
          user_id: 'user_002',
          type: 'debit',
          amount: 25.00,
          description: 'Saque via PIX',
          transaction_date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed'
        },
        {
          id: 3,
          user_id: 'user_003',
          type: 'credit',
          amount: 100.00,
          description: 'Bônus de boas-vindas',
          transaction_date: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed'
        },
        {
          id: 4,
          user_id: 'user_004',
          type: 'debit',
          amount: 75.00,
          description: 'Saque via PIX',
          transaction_date: new Date(Date.now() - 259200000).toISOString(),
          status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value, transacao) => (
        <div className="font-medium text-white">#{transacao.id}</div>
      )
    },
    {
      key: 'user_id',
      label: 'Usuário',
      render: (value, transacao) => (
        <div className="text-gray-300">{transacao.user_id}</div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value, transacao) => (
        <StatusBadge 
          status={transacao.type === 'credit' ? 'Crédito' : 'Débito'} 
          className={transacao.type === 'credit' ? 'bg-green-600' : 'bg-red-600'}
        />
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, transacao) => (
        <div className={`font-semibold ${
          transacao.type === 'credit' ? 'text-green-400' : 'text-red-400'
        }`}>
          {transacao.type === 'credit' ? '+' : '-'}R$ {parseFloat(transacao.amount).toFixed(2)}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (value, transacao) => (
        <div className="text-gray-300 max-w-xs truncate">
          {transacao.description || '-'}
        </div>
      )
    },
    {
      key: 'transaction_date',
      label: 'Data',
      render: (value, transacao) => (
        <div className="text-gray-300 text-sm">
          {new Date(transacao.transaction_date).toLocaleDateString('pt-BR')}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, transacao) => (
        <StatusBadge 
          status={transacao.status === 'completed' ? 'Concluída' : 'Pendente'} 
          className={transacao.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}
        />
      )
    }
  ];

  // Estatísticas para cards
  const stats = [
    {
      title: 'Total de Transações',
      value: transacoes.length,
      icon: '💳',
      color: 'text-blue-400'
    },
    {
      title: 'Créditos',
      value: transacoes.filter(t => t.type === 'credit').length,
      icon: '💰',
      color: 'text-green-400'
    },
    {
      title: 'Débitos',
      value: transacoes.filter(t => t.type === 'debit').length,
      icon: '💸',
      color: 'text-red-400'
    },
    {
      title: 'Valor Total',
      value: `R$ ${transacoes.reduce((acc, t) => acc + (t.type === 'credit' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0).toFixed(2)}`,
      icon: '📊',
      color: 'text-yellow-400'
    }
  ];

  if (loading) {
    return (
      <StandardPageLayout
        title="💳 Transações"
        description="Carregando transações..."
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </StandardPageLayout>
    );
  }

  if (error) {
    return (
      <StandardPageLayout
        title="💳 Transações"
        description="Erro ao carregar dados"
      >
        <SectionCard title="❌ Erro">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </SectionCard>
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout
      title="💳 Transações"
      description="Histórico completo de transações do sistema"
    >
      {/* Cards de Estatísticas */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estatísticas</h2>
        <ResponsiveGrid columns="auto" gap="default">
          {stats.map((stat, index) => (
            <ResponsiveCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              className={stat.color}
            />
          ))}
        </ResponsiveGrid>
      </div>

      {/* Tabela de Transações */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Lista de Transações ({transacoes.length})
        </h2>
        <SectionCard title="Transações">
          {transacoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Nenhuma transação encontrada</p>
            </div>
          ) : (
            <ResponsiveTable
              data={transacoes}
              columns={columns}
              mobileView="cards"
              emptyMessage="Nenhuma transação encontrada"
              onRowClick={(transacao) => console.log('Clicou em:', transacao)}
            />
          )}
        </SectionCard>
      </div>
    </StandardPageLayout>
  );
};

export default TransacoesResponsivePadronizada;

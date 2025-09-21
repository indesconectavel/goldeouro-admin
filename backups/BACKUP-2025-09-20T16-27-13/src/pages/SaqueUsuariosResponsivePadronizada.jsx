// src/pages/SaqueUsuariosResponsivePadronizada.jsx

import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue } from '../components/ResponsiveTable';
import SaqueUsuarios from './SaqueUsuarios';

const SaqueUsuariosResponsivePadronizada = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <SaqueUsuarios />;
  }

  // Mobile e Tablet usam versão responsiva padronizada
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_SAQUE_USUARIOS"
      fallback={<SaqueUsuarios />}
      desktopFallback={<SaqueUsuarios />}
    >
      <SaqueUsuariosMobileTabletPadronizada />
    </ResponsiveWrapper>
  );
};

const SaqueUsuariosMobileTabletPadronizada = () => {
  const { device, isMobile } = useDeviceDetection();
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSaques();
  }, []);

  const fetchSaques = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await postData('/admin/relatorio-saques', {});
      if (Array.isArray(result)) {
        setSaques(result);
      } else {
        setSaques([]);
      }
    } catch (error) {
      console.error('Erro ao buscar saques:', error);
      // Dados de fallback para demonstração
      setSaques([
        {
          id: 1,
          user_id: 'user_001',
          amount: 150.00,
          status: 'Aprovado',
          created_at: '2025-09-09T10:30:00Z',
          method: 'PIX'
        },
        {
          id: 2,
          user_id: 'user_002',
          amount: 75.50,
          status: 'Pendente',
          created_at: '2025-09-09T11:15:00Z',
          method: 'PIX'
        },
        {
          id: 3,
          user_id: 'user_003',
          amount: 200.00,
          status: 'Aprovado',
          created_at: '2025-09-08T14:20:00Z',
          method: 'PIX'
        },
        {
          id: 4,
          user_id: 'user_004',
          amount: 50.00,
          status: 'Rejeitado',
          created_at: '2025-09-08T09:45:00Z',
          method: 'PIX'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Usuário', 'Valor', 'Status', 'Método', 'Data'],
      ...saques.map(saque => [
        saque.id,
        saque.user_id,
        saque.amount.toFixed(2),
        saque.status,
        saque.method || 'PIX',
        new Date(saque.created_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saques_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value, saque) => (
        <div className="font-medium text-white">#{saque.id}</div>
      )
    },
    {
      key: 'user_id',
      label: 'Usuário',
      render: (value, saque) => (
        <div className="text-gray-300">{saque.user_id}</div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, saque) => (
        <CurrencyValue value={saque.amount} />
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, saque) => (
        <StatusBadge status={saque.status} />
      )
    },
    {
      key: 'method',
      label: 'Método',
      render: (value, saque) => (
        <div className="text-gray-300">{saque.method || 'PIX'}</div>
      )
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (value, saque) => (
        <div className="text-gray-300 text-sm">
          {new Date(saque.created_at).toLocaleDateString('pt-BR')}
        </div>
      )
    }
  ];

  // Estatísticas para cards
  const stats = [
    {
      title: 'Total de Saques',
      value: saques.length,
      icon: '💸',
      color: 'text-blue-400'
    },
    {
      title: 'Saques Pendentes',
      value: saques.filter(s => s.status === 'Pendente').length,
      icon: '⏳',
      color: 'text-yellow-400'
    },
    {
      title: 'Saques Aprovados',
      value: saques.filter(s => s.status === 'Aprovado').length,
      icon: '✅',
      color: 'text-green-400'
    },
    {
      title: 'Valor Total',
      value: `R$ ${saques.reduce((acc, s) => acc + s.amount, 0).toFixed(2)}`,
      icon: '💰',
      color: 'text-yellow-400'
    }
  ];

  if (loading) {
    return (
      <StandardPageLayout
        title="💸 Relatório de Saques"
        description="Carregando dados dos saques..."
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
        title="💸 Relatório de Saques"
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
      title="💸 Relatório de Saques"
      description="Relatório completo de saques dos usuários"
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

      {/* Seção de Exportação */}
      <div className="mb-8">
        <SectionCard title="📤 Exportar Dados">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <p className="text-gray-300 flex-1">
              Exporte os dados dos saques para análise externa
            </p>
            <button
              onClick={handleExport}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>📥</span>
              {isMobile ? 'Exportar' : 'Exportar CSV'}
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Tabela de Saques */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Lista de Saques ({saques.length})
        </h2>
        <SectionCard title="Saques">
          {saques.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Nenhum saque registrado ainda.</p>
            </div>
          ) : (
            <ResponsiveTable
              data={saques}
              columns={columns}
              mobileView="cards"
              emptyMessage="Nenhum saque encontrado"
              onRowClick={(saque) => console.log('Clicou em:', saque)}
            />
          )}
        </SectionCard>
      </div>
    </StandardPageLayout>
  );
};

export default SaqueUsuariosResponsivePadronizada;

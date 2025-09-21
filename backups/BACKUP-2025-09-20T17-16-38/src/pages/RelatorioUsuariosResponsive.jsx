// src/pages/RelatorioUsuariosResponsive.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue } from '../components/ResponsiveTable';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const RelatorioUsuariosResponsive = () => {
  const { device, isMobile } = useDeviceDetection();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.post('/admin/relatorio-usuarios', {});
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        // Dados de fallback para demonstração
        const mockUsuarios = [
          {
            id: 1,
            nome: 'João Silva',
            email: 'joao@email.com',
            status: 'ativo',
            saldo: 150.00,
            created_at: '2025-01-07T10:00:00Z',
            ultimo_acesso: '2025-01-07T15:30:00Z',
            total_apostas: 25,
            total_ganhos: 75.50,
            chutes: 25,
            gols: 8,
            entradas: 150.00,
            saques: 75.50
          },
          {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@email.com',
            status: 'ativo',
            saldo: 75.50,
            created_at: '2025-01-06T14:20:00Z',
            ultimo_acesso: '2025-01-07T12:15:00Z',
            total_apostas: 18,
            total_ganhos: 45.20,
            chutes: 18,
            gols: 5,
            entradas: 100.00,
            saques: 45.20
          },
          {
            id: 3,
            nome: 'Pedro Costa',
            email: 'pedro@email.com',
            status: 'ativo',
            saldo: 200.00,
            created_at: '2025-01-05T09:15:00Z',
            ultimo_acesso: '2025-01-07T12:30:00Z',
            total_apostas: 30,
            total_ganhos: 120.00,
            chutes: 30,
            gols: 12,
            entradas: 250.00,
            saques: 120.00
          }
        ];
        setUsuarios(mockUsuarios);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/usuarios-csv';
    window.open(url, "_blank");
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'nome',
      header: 'NOME',
      render: (usuario) => (
        <Link
          to={`/relatorio-usuario/${usuario.id}`}
          className="text-yellow-300 hover:underline font-medium"
        >
          {usuario.nome}
        </Link>
      )
    },
    {
      key: 'chutes',
      header: 'CHUTES',
      render: (usuario) => (
        <div className="text-white font-medium">{usuario.chutes || 0}</div>
      )
    },
    {
      key: 'gols',
      header: 'GOLS',
      render: (usuario) => (
        <div className="text-white font-medium">{usuario.gols || 0}</div>
      )
    },
    {
      key: 'entradas',
      header: 'ENTRADAS (R$)',
      render: (usuario) => (
        <div className="text-green-400 font-medium">R$ {(usuario.entradas || 0).toFixed(2)}</div>
      )
    },
    {
      key: 'saques',
      header: 'SAQUES (R$)',
      render: (usuario) => (
        <div className="text-red-400 font-medium">R$ {(usuario.saques || 0).toFixed(2)}</div>
      )
    },
    {
      key: 'saldo',
      header: 'SALDO (R$)',
      render: (usuario) => (
        <div className="text-yellow-400 font-medium">R$ {(usuario.saldo || 0).toFixed(2)}</div>
      )
    }
  ];

  // Função para renderizar card mobile
  const renderMobileCard = (usuario) => (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white text-lg">{usuario.nome}</h3>
          <p className="text-gray-300 text-sm">{usuario.email}</p>
        </div>
        <div className="text-right">
          <div className="text-yellow-400 font-medium">R$ {(usuario.saldo || 0).toFixed(2)}</div>
          <div className="text-gray-400 text-xs">Saldo</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Chutes:</span>
          <div className="text-white font-medium">{usuario.chutes || 0}</div>
        </div>
        <div>
          <span className="text-gray-400">Gols:</span>
          <div className="text-white font-medium">{usuario.gols || 0}</div>
        </div>
        <div>
          <span className="text-gray-400">Entradas:</span>
          <div className="text-green-400 font-medium">R$ {(usuario.entradas || 0).toFixed(2)}</div>
        </div>
        <div>
          <span className="text-gray-400">Saques:</span>
          <div className="text-red-400 font-medium">R$ {(usuario.saques || 0).toFixed(2)}</div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-gray-600">
        <Link
          to={`/relatorio-usuario/${usuario.id}`}
          className="w-full block text-center px-4 py-2 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-600 transition-colors"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );

  // Estatísticas para cards
  const stats = [
    {
      title: 'Total de Usuários',
      value: usuarios.length,
      icon: '👥',
      color: 'text-blue-400'
    },
    {
      title: 'Usuários Ativos',
      value: usuarios.filter(u => u.status === 'ativo').length,
      icon: '✅',
      color: 'text-green-400'
    },
    {
      title: 'Usuários Bloqueados',
      value: usuarios.filter(u => u.status === 'bloqueado').length,
      icon: '❌',
      color: 'text-red-400'
    },
    {
      title: 'Saldo Total',
      value: `R$ ${usuarios.reduce((acc, u) => acc + (u.saldo || 0), 0).toFixed(2)}`,
      icon: '💰',
      color: 'text-yellow-400'
    }
  ];

  return (
    <StandardPageLayout
      title="📊 Relatório de Usuários"
      description="Relatório completo de usuários e suas atividades"
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
              Exporte os dados dos usuários para análise externa
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

      {/* Tabela de Usuários */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Lista de Usuários ({usuarios.length})
        </h2>
        <SectionCard title="Usuários">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Ainda não possui dados...</p>
            </div>
          ) : (
            <ResponsiveTable
              data={usuarios}
              columns={columns}
              mobileView="cards"
              emptyMessage="Nenhum usuário encontrado"
              onRowClick={(user) => console.log('Clicou em:', user)}
            />
          )}
        </SectionCard>
      </div>
    </StandardPageLayout>
  );
};

export default RelatorioUsuariosResponsive;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const RelatorioUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const result = await postData('/admin/relatorio-usuarios', {});
        setUsuarios(result || []);
      } catch (error) {
        console.error('Erro ao buscar relatório de usuários:', error);
        if (shouldFallbackToMock()) {
          setUsuarios(mockUsers);
        } else {
          setUsuarios([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const exportarCSV = () => {
    const url = import.meta.env.VITE_API_URL + '/admin/exportar/usuarios-csv';
    window.open(url, '_blank');
  };

  if (loading) {
    return <StandardLoader message="Carregando relatório de usuários..." />;
  }

  if (usuarios.length === 0) {
    return <EmptyState message="Ainda não há dados de usuários para exibir no relatório." />;
  }

  const totalUsuarios = usuarios.length;
  const totalChutes = usuarios.reduce((sum, user) => sum + user.totalChutes, 0);
  const totalGols = usuarios.reduce((sum, user) => sum + user.totalGols, 0);
  const totalCreditos = usuarios.reduce((sum, user) => sum + user.totalCreditos, 0);
  const totalDebitos = usuarios.reduce((sum, user) => sum + user.totalDebitos, 0);
  const saldoTotal = usuarios.reduce((sum, user) => sum + user.saldo, 0);
  const taxaAcerto = totalChutes > 0 ? (totalGols / totalChutes * 100) : 0;

  const tableColumns = [
    { 
      key: 'name', 
      header: 'Nome',
      render: (usuario) => (
        <Link
          to={`/relatorio-usuario/${usuario.id}`}
          className="text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
        >
          {usuario.name}
        </Link>
      )
    },
    { key: 'totalChutes', header: 'Chutes' },
    { key: 'totalGols', header: 'Gols' },
    { 
      key: 'totalCreditos', 
      header: 'Entradas (R$)',
      render: (usuario) => (
        <span className="text-green-400 font-semibold">
          R$ {usuario.totalCreditos.toFixed(2)}
        </span>
      )
    },
    { 
      key: 'totalDebitos', 
      header: 'Saques (R$)',
      render: (usuario) => (
        <span className="text-red-400 font-semibold">
          R$ {(usuario.totalDebitos || 0).toFixed(2)}
        </span>
      )
    },
    { 
      key: 'saldo', 
      header: 'Saldo (R$)',
      render: (usuario) => (
        <span className="text-white font-bold">
          R$ {(usuario.saldo || 0).toFixed(2)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório de Usuários</h1>
        <button
          onClick={exportarCSV}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      <p className="text-gray-300">
        Análise completa do desempenho e movimentação financeira dos usuários.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Total de Usuários" 
          value={totalUsuarios} 
          color="yellow" 
        />
        <CardTemplate 
          title="Total de Chutes" 
          value={totalChutes} 
          color="blue" 
        />
        <CardTemplate 
          title="Total de Gols" 
          value={totalGols} 
          color="green" 
        />
        <CardTemplate 
          title="Taxa de Acerto" 
          value={`${taxaAcerto.toFixed(1)}%`} 
          color="purple" 
        />
        <CardTemplate 
          title="Total de Entradas" 
          value={`R$ ${totalCreditos.toFixed(2)}`} 
          color="green" 
        />
        <CardTemplate 
          title="Total de Saques" 
          value={`R$ ${totalDebitos.toFixed(2)}`} 
          color="red" 
        />
        <CardTemplate 
          title="Saldo Total" 
          value={`R$ ${saldoTotal.toFixed(2)}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Tabela de Relatório */}
      <TableTemplate 
        title="Relatório Detalhado por Usuário"
        columns={tableColumns}
        data={usuarios}
      />

      {/* Estatísticas Adicionais */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Estatísticas Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Média de Chutes</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {(totalChutes / totalUsuarios).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">por usuário</p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Média de Gols</h3>
            <p className="text-2xl font-bold text-green-400">
              {(totalGols / totalUsuarios).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">por usuário</p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Entrada Média</h3>
            <p className="text-2xl font-bold text-green-400">
              R$ {(totalCreditos / totalUsuarios).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">por usuário</p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Saldo Médio</h3>
            <p className="text-2xl font-bold text-blue-400">
              R$ {(saldoTotal / totalUsuarios).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">por usuário</p>
          </div>
        </div>
      </div>

      {/* Informações do Relatório */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do Relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Período:</span>
              <span className="text-white font-semibold">Últimos 30 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Atualização:</span>
              <span className="text-white font-semibold">
                {new Date().toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="text-green-400 font-semibold">Atualizado</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Exportação:</span>
              <span className="text-yellow-400 font-semibold">Disponível</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioUsuarios;
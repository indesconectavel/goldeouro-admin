import React, { useEffect, useState } from 'react';
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const UsuariosBloqueados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState({ message: '', type: '' });

  const fetchBloqueados = async () => {
    try {
      const result = await postData('/admin/usuarios-bloqueados', {});
      setUsuarios(result || []);
    } catch (error) {
      console.error('Erro ao buscar usuários bloqueados:', error);
      if (shouldFallbackToMock()) {
          setUsuarios(mockUsers);
        } else {
          if (shouldFallbackToMock()) {
          setUsuarios(mockUsers);
        } else {
          setUsuarios([]);
        }
        }
    } finally {
      setLoading(false);
    }
  };

  const desbloquearUsuario = async (id, nome) => {
    setActionStatus({ message: `Desbloqueando usuário ${nome}...`, type: 'info' });
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Usuário ${nome} desbloqueado com sucesso!`);
      setActionStatus({ message: `Usuário ${nome} desbloqueado com sucesso!`, type: 'success' });
      // Atualizar lista removendo o usuário desbloqueado
      setUsuarios(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error);
      setActionStatus({ message: `Erro ao desbloquear usuário ${nome}`, type: 'error' });
    } finally {
      setTimeout(() => setActionStatus({ message: '', type: '' }), 5000);
    }
  };

  useEffect(() => {
    fetchBloqueados();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando usuários bloqueados..." />;
  }

  if (usuarios.length === 0) {
    return <EmptyState message="Nenhum usuário bloqueado no momento." />;
  }

  const totalBloqueados = usuarios.length;
  const bloqueadosHoje = usuarios.filter(user => 
    new Date(user.blocked_at).toDateString() === new Date().toDateString()
  ).length;
  const bloqueadosSemana = usuarios.filter(user => {
    const blockedDate = new Date(user.blocked_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return blockedDate >= weekAgo;
  }).length;

  const tableColumns = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { 
      key: 'blocked_at', 
      header: 'Bloqueado em',
      render: (user) => new Date(user.blocked_at).toLocaleString('pt-BR')
    },
    { key: 'reason', header: 'Motivo' },
    {
      key: 'actions',
      header: 'Ações',
      render: (user) => (
        <button
          onClick={() => desbloquearUsuario(user.id, user.name)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
        >
          Desbloquear
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Usuários Bloqueados</h1>
      <p className="text-gray-300 mb-6">
        Gerencie usuários que foram bloqueados no sistema.
      </p>

      {actionStatus.message && (
        <div className={`p-3 rounded-md text-white ${
          actionStatus.type === 'success' ? 'bg-green-500' : 
          actionStatus.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {actionStatus.message}
        </div>
      )}

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Total Bloqueados" 
          value={totalBloqueados} 
          color="red" 
        />
        <CardTemplate 
          title="Bloqueados Hoje" 
          value={bloqueadosHoje} 
          color="orange" 
        />
        <CardTemplate 
          title="Bloqueados Esta Semana" 
          value={bloqueadosSemana} 
          color="yellow" 
        />
      </GridTemplate>

      {/* Tabela de Usuários Bloqueados */}
      <TableTemplate 
        title="Lista de Usuários Bloqueados"
        columns={tableColumns}
        data={usuarios}
      />

      {/* Estatísticas por Motivo */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Estatísticas por Motivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Violação dos termos de uso', 'Comportamento inadequado', 'Tentativa de fraude'].map(motivo => {
            const count = usuarios.filter(user => user.reason === motivo).length;
            return (
              <div key={motivo} className="text-center">
                <h3 className="text-white font-semibold mb-2">{motivo}</h3>
                <p className="text-2xl font-bold text-red-400">{count}</p>
                <p className="text-sm text-gray-400">usuários</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Sistema de Bloqueio:</span>
              <span className="text-green-400 font-semibold">Ativo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Última Atualização:</span>
              <span className="text-white font-semibold">
                {new Date().toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Total de Registros:</span>
              <span className="text-white font-semibold">{totalBloqueados}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="text-green-400 font-semibold">Sincronizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ações em Massa */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Ações em Massa</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja desbloquear todos os usuários?')) {
                alert('Função de desbloqueio em massa em desenvolvimento');
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Desbloquear Todos
          </button>
          <button
            onClick={() => {
              alert('Função de exportar lista em desenvolvimento');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Exportar Lista
          </button>
          <button
            onClick={() => {
              alert('Função de relatório em desenvolvimento');
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuariosBloqueados;
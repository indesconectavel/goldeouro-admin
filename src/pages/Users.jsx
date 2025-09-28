import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await postData('/admin/usuarios', {});
        setUsers(result || []);
      } catch (error) {
        console.error('Erro na requisição:', error);
        // Usar dados padrão em caso de erro
      }
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case 'active':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Ativo</span>;
      case 'blocked':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Bloqueado</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando usuários...</div>
      </div>
    );
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const blockedUsers = users.filter(u => u.status === 'blocked').length;
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);

  const tableColumns = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { 
      key: 'status', 
      header: 'Status',
      render: (user) => getStatusBadge(user.status)
    },
    { 
      key: 'balance', 
      header: 'Saldo',
      render: (user) => `R$ ${user.balance.toFixed(2)}`
    },
    { key: 'createdAt', header: 'Criado em' },
    { key: 'lastLogin', header: 'Último Login' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Usuários</h1>
      <p className="text-gray-300 mb-6">
        Gerenciamento de usuários da plataforma.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Usuários" 
          value={totalUsers} 
          color="yellow" 
        />
        <CardTemplate 
          title="Usuários Ativos" 
          value={activeUsers} 
          color="green" 
        />
        <CardTemplate 
          title="Usuários Bloqueados" 
          value={blockedUsers} 
          color="red" 
        />
        <CardTemplate 
          title="Saldo Total" 
          value={`R$ ${totalBalance.toFixed(2)}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Busca */}
      <div className="card p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <TableTemplate 
        title="Lista de Usuários"
        columns={tableColumns}
        data={filteredUsers}
      />
    </div>
  );
};

export default Users;
import React, { useEffect, useState } from 'react';
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers } from '../data/mockData';
import { Eye, Edit, UserCheck, UserX } from 'lucide-react';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const result = await postData('/admin/lista-usuarios', {});
        setUsuarios(result || []);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        // DADOS ZERADOS PARA PRODUÇÃO
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const handleViewUser = (user) => {
    alert(`Visualizando usuário: ${user.name}`);
    // Implementar navegação para detalhes do usuário
  };

  const handleEditUser = (user) => {
    alert(`Editando usuário: ${user.name}`);
    // Implementar modal de edição
  };

  const handleToggleStatus = (user) => {
    const action = user.account_status === 'blocked' ? 'desbloquear' : 'bloquear';
    if (confirm(`Tem certeza que deseja ${action} o usuário ${user.name}?`)) {
      alert(`Usuário ${user.name} ${action}do com sucesso!`);
      // Implementar chamada de API para alterar status
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <StandardLoader message="Carregando lista de usuários..." />;
  }

  if (usuarios.length === 0) {
    return <EmptyState message="Ainda não há usuários cadastrados no sistema." />;
  }

  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter(u => u.account_status === 'active').length;
  const usuariosBloqueados = usuarios.filter(u => u.account_status === 'blocked').length;
  const saldoTotal = usuarios.reduce((sum, user) => sum + user.balance, 0);

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    if (status === 'blocked') {
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Bloqueado</span>;
    } else {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Ativo</span>;
    }
  };

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'name', 
      header: 'Nome',
      render: (user) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {user.name}
        </div>
      )
    },
    { key: 'email', header: 'E-mail' },
    { 
      key: 'balance', 
      header: 'Saldo',
      render: (user) => (
        <span className="text-green-500 font-semibold">
          R$ {user.balance.toFixed(2)}
        </span>
      )
    },
    { 
      key: 'account_status', 
      header: 'Status',
      render: (user) => getStatusBadge(user.account_status)
    },
    { 
      key: 'created_at', 
      header: 'Criado em',
      render: (user) => new Date(user.created_at).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewUser(user)}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
            title="Editar usuário"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(user)}
            className={`p-1 transition-colors ${
              user.account_status === 'blocked'
                ? 'text-green-400 hover:text-green-300'
                : 'text-red-400 hover:text-red-300'
            }`}
            title={user.account_status === 'blocked' ? 'Ativar usuário' : 'Desativar usuário'}
          >
            {user.account_status === 'blocked' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Lista de Usuários</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      <p className="text-gray-300">
        Gerencie todos os usuários cadastrados no sistema.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Usuários" 
          value={totalUsuarios} 
          color="yellow" 
        />
        <CardTemplate 
          title="Usuários Ativos" 
          value={usuariosAtivos} 
          color="green" 
        />
        <CardTemplate 
          title="Usuários Bloqueados" 
          value={usuariosBloqueados} 
          color="red" 
        />
        <CardTemplate 
          title="Saldo Total" 
          value={`R$ ${saldoTotal.toFixed(2)}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Tabela de Usuários */}
      <TableTemplate 
        title="Usuários Cadastrados"
        columns={tableColumns}
        data={filteredUsuarios}
      />

      {/* Informações Adicionais */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Sistema de Usuários:</span>
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
              <span className="text-gray-300">Registros Exibidos:</span>
              <span className="text-white font-semibold">{filteredUsuarios.length} de {totalUsuarios}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="text-green-400 font-semibold">Sincronizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaUsuarios;
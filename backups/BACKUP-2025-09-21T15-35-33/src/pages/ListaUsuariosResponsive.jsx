import React, { useEffect, useState } from 'react';
import { config, getAuthToken } from '../config/env';
import Loader from '../components/Loader';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue } from '../components/ResponsiveTable';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const ListaUsuariosResponsive = () => {
  const { device } = useDeviceDetection();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    status: 'all',
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log('📦 Componente ListaUsuariosResponsive carregado');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await fetch(`${config.API_URL}/admin/lista-usuarios`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': config.ADMIN_TOKEN || '',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        // Dados de fallback para demonstração
        const mockUsuarios = [
          {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            account_status: 'active',
            balance: 150.00,
            created_at: '2025-01-07T10:00:00Z',
            ultimo_acesso: '2025-01-07T15:30:00Z'
          },
          {
            id: 2,
            name: 'Maria Santos',
            email: 'maria@email.com',
            account_status: 'blocked',
            balance: 75.50,
            created_at: '2025-01-06T14:20:00Z',
            ultimo_acesso: '2025-01-06T16:45:00Z'
          },
          {
            id: 3,
            name: 'Pedro Costa',
            email: 'pedro@email.com',
            account_status: 'active',
            balance: 200.00,
            created_at: '2025-01-05T09:15:00Z',
            ultimo_acesso: '2025-01-07T12:30:00Z'
          }
        ];
        setUsuarios(mockUsuarios);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario => {
      const matchStatus = filtros.status === 'all' || usuario.account_status === filtros.status;
      const matchSearch = filtros.search === '' || 
        usuario.name.toLowerCase().includes(filtros.search.toLowerCase()) ||
        usuario.email.toLowerCase().includes(filtros.search.toLowerCase());
      return matchStatus && matchSearch;
    });
  };

  const handleUserAction = (user, action) => {
    console.log(`Ação ${action} para usuário:`, user);
    setSelectedUser(user);
    setShowModal(true);
    // Aqui você implementaria as ações de editar/banir usuário
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900';
      case 'blocked': return 'text-red-400 bg-red-900';
      case 'suspended': return 'text-yellow-400 bg-yellow-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'blocked': return 'Bloqueado';
      case 'suspended': return 'Suspenso';
      default: return 'Desconhecido';
    }
  };

  // Configuração das colunas da tabela padronizada
  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value, user) => (
        <div className="font-medium text-white">{user.name}</div>
      )
    },
    {
      key: 'email',
      label: 'E-mail',
      render: (value, user) => (
        <div className="text-gray-300">{user.email}</div>
      )
    },
    {
      key: 'account_status',
      label: 'Status',
      render: (value, user) => (
        <StatusBadge status={user.account_status} />
      )
    },
    {
      key: 'balance',
      label: 'Saldo',
      render: (value, user) => (
        <CurrencyValue value={user.balance || 0} />
      )
    },
    {
      key: 'created_at',
      label: 'Criado em',
      render: (value, user) => (
        <div className="text-gray-300 text-sm">
          {new Date(user.created_at).toLocaleDateString('pt-BR')}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value, user) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUserAction(user, 'edit')}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => handleUserAction(user, 'toggle')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              user.account_status === 'active' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {user.account_status === 'active' ? 'Bloquear' : 'Ativar'}
          </button>
        </div>
      )
    }
  ];

  // Função para renderizar card mobile
  const renderMobileCard = (user) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white text-lg">{user.name}</h3>
          <p className="text-gray-300 text-sm">{user.email}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.account_status)}`}>
          {getStatusText(user.account_status)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Saldo:</span>
          <div className="text-green-400 font-medium">R$ {user.balance ? parseFloat(user.balance).toFixed(2) : '0.00'}</div>
        </div>
        <div>
          <span className="text-gray-400">Criado em:</span>
          <div className="text-gray-300">{new Date(user.created_at).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-gray-600">
        <button
          onClick={() => handleUserAction(user, 'edit')}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Editar
        </button>
        <button
          onClick={() => handleUserAction(user, 'toggle')}
          className={`flex-1 px-3 py-2 text-sm rounded ${
            user.account_status === 'active' 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {user.account_status === 'active' ? 'Bloquear' : 'Ativar'}
        </button>
      </div>
    </div>
  );

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-8">
        <div className="text-center">
          <h2 className="text-2xl text-red-400 mb-4">Erro ao carregar usuários</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const usuariosFiltrados = filtrarUsuarios();

  // Estatísticas para cards
  const stats = [
    {
      title: 'Total de Usuários',
      value: usuarios.length.toString(),
      icon: '👥',
      trend: 0
    },
    {
      title: 'Usuários Ativos',
      value: usuarios.filter(u => u.account_status === 'active').length.toString(),
      icon: '✅',
      trend: 0
    },
    {
      title: 'Usuários Bloqueados',
      value: usuarios.filter(u => u.account_status === 'blocked').length.toString(),
      icon: '🚫',
      trend: 0
    },
    {
      title: 'Saldo Total',
      value: `R$ ${usuarios.reduce((sum, u) => sum + (parseFloat(u.balance) || 0), 0).toFixed(2)}`,
      icon: '💰',
      trend: 0
    }
  ];

  return (
    <StandardPageLayout
      title="👥 Gerenciamento de Usuários"
      description="Gerencie usuários, status e permissões do sistema"
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
            />
          ))}
        </ResponsiveGrid>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <SectionCard title="🔍 Filtros de Busca">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-yellow-400 focus:outline-none"
              >
                <option value="all">Todos</option>
                <option value="active">Ativo</option>
                <option value="blocked">Bloqueado</option>
                <option value="suspended">Suspenso</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Nome ou email..."
                value={filtros.search}
                onChange={(e) => setFiltros({...filtros, search: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFiltros({status: 'all', search: ''})}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Tabela de Usuários */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Lista de Usuários ({usuariosFiltrados.length} de {usuarios.length})
        </h2>
        <SectionCard title="Usuários">
          <ResponsiveTable
            columns={columns}
            data={usuariosFiltrados}
            mobileView="cards"
            emptyMessage="Nenhum usuário encontrado"
            onRowClick={(user) => console.log('Clicou em:', user)}
          />
        </SectionCard>
      </div>

      {/* Modal para ações do usuário */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">
              Ações para {selectedUser.name}
            </h3>
            <p className="text-gray-300 mb-4">
              Email: {selectedUser.email}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  console.log('Ação confirmada para:', selectedUser);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </StandardPageLayout>
  );
};

export default ListaUsuariosResponsive;

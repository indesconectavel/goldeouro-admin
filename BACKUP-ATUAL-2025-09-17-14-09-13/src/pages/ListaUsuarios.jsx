import React, { useEffect, useState } from 'react';
import { config, getAuthToken } from '../config/env';
import Loader from '../components/Loader';
import ResponsiveTable from '../components/ResponsiveTable';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const ListaUsuarios = () => {
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

  console.log('📦 Componente ListaUsuarios carregado');

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
            nome: 'João Silva',
            email: 'joao@email.com',
            status: 'ativo',
            saldo: 150.00,
            created_at: '2025-01-07T10:00:00Z',
            ultimo_acesso: '2025-01-07T15:30:00Z'
          },
          {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@email.com',
            status: 'ativo',
            saldo: 75.50,
            created_at: '2025-01-06T14:20:00Z',
            ultimo_acesso: '2025-01-07T12:15:00Z'
          },
          {
            id: 3,
            nome: 'Pedro Costa',
            email: 'pedro@email.com',
            status: 'bloqueado',
            saldo: 0.00,
            created_at: '2025-01-05T09:30:00Z',
            ultimo_acesso: '2025-01-06T18:45:00Z'
          }
        ];
        setUsuarios(mockUsuarios);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const filtrarUsuarios = () => {
    let filtrados = [...usuarios];

    if (filtros.status !== 'all') {
      filtrados = filtrados.filter(u => u.account_status === filtros.status);
    }

    if (filtros.search) {
      filtrados = filtrados.filter(u => 
        u.name.toLowerCase().includes(filtros.search.toLowerCase()) ||
        u.email.toLowerCase().includes(filtros.search.toLowerCase())
      );
    }

    return filtrados;
  };

  const handleUserAction = (user, action) => {
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

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'nome',
      header: 'Nome',
      render: (user) => (
        <div className="font-medium text-white">{user.nome}</div>
      )
    },
    {
      key: 'email',
      header: 'E-mail',
      render: (user) => (
        <div className="text-gray-300">{user.email}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {getStatusText(user.status)}
        </span>
      )
    },
    {
      key: 'saldo',
      header: 'Saldo',
      render: (user) => (
        <div className="text-green-400 font-medium">R$ {user.saldo?.toFixed(2) || '0.00'}</div>
      )
    },
    {
      key: 'created_at',
      header: 'Criado em',
      render: (user) => (
        <div className="text-gray-300 text-sm">
          {new Date(user.created_at).toLocaleDateString('pt-BR')}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (user) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUserAction(user, 'edit')}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            onClick={() => handleUserAction(user, 'ban')}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Banir
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
          <h3 className="font-medium text-white text-lg">{user.nome}</h3>
          <p className="text-gray-300 text-sm">{user.email}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {getStatusText(user.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Saldo:</span>
          <div className="text-green-400 font-medium">R$ {user.saldo?.toFixed(2) || '0.00'}</div>
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
          onClick={() => handleUserAction(user, 'ban')}
          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Banir
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

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8 rounded shadow-md max-w-7xl mx-auto mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-yellow-400">Gerenciamento de Usuários</h1>
        <p className="text-sm text-gray-400">
          Total de usuários: {usuariosFiltrados.length} de {usuarios.length}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] mb-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-white"
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
              className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFiltros({status: 'all', search: ''})}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-[#2c3e50] rounded-lg shadow-sm">
          <thead className="bg-[#111827] text-yellow-300 uppercase text-sm">
            <tr>
              <th className="px-4 py-3 border border-[#2c3e50]">Nome</th>
              <th className="px-4 py-3 border border-[#2c3e50]">E-mail</th>
              <th className="px-4 py-3 border border-[#2c3e50]">Status</th>
              <th className="px-4 py-3 border border-[#2c3e50]">Saldo</th>
              <th className="px-4 py-3 border border-[#2c3e50]">Criado em</th>
              <th className="px-4 py-3 border border-[#2c3e50]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-4 py-3 border border-[#2c3e50] text-white">
                  {usuario.name}
                </td>
                <td className="px-4 py-3 border border-[#2c3e50] text-gray-300">
                  {usuario.email}
                </td>
                <td className="px-4 py-3 border border-[#2c3e50]">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(usuario.account_status)}`}>
                    {getStatusText(usuario.account_status)}
                  </span>
                </td>
                <td className="px-4 py-3 border border-[#2c3e50] text-green-400 font-semibold">
                  R$ {usuario.balance ? parseFloat(usuario.balance).toFixed(2) : '0.00'}
                </td>
                <td className="px-4 py-3 border border-[#2c3e50] text-gray-400">
                  {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 border border-[#2c3e50]">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUserAction(usuario, 'edit')}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleUserAction(usuario, 'toggle')}
                      className={`px-2 py-1 rounded text-xs ${
                        usuario.account_status === 'active' 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {usuario.account_status === 'active' ? 'Bloquear' : 'Ativar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuariosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhum usuário encontrado com os filtros aplicados</p>
          </div>
        )}
      </div>

      {/* Modal de Ações */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              Ações para {selectedUser.name}
            </h3>
            <div className="space-y-4">
              <div className="text-gray-400">
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Status:</strong> {getStatusText(selectedUser.account_status)}</p>
                <p><strong>Saldo:</strong> R$ {selectedUser.balance ? parseFloat(selectedUser.balance).toFixed(2) : '0.00'}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Implementar ação aqui
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaUsuarios;
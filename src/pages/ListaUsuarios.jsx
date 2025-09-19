import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/admin/lista-usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <Loader />;

  if (!usuarios.length) {
    return (
      <div className="card text-center">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Lista de Usuários</h1>
        <p className="text-gray-400">Ainda não possui dados de usuários cadastrados...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-yellow-400">Lista de Usuários</h1>
        <p className="text-sm text-gray-400">
          Total de usuários cadastrados: {usuarios.length}
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Saldo</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.id}</td>
                <td>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="text-green-500 font-semibold">
                    R$ {user.balance ? user.balance.toFixed(2) : '0.00'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${
                    user.account_status === 'blocked'
                      ? 'status-inactive'
                      : 'status-active'
                  }`}>
                    {user.account_status === 'blocked' ? 'Bloqueado' : 'Ativo'}
                  </span>
                </td>
                <td>
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="action-btn text-blue-400"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="action-btn text-yellow-400"
                      title="Editar usuário"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`action-btn ${
                        user.account_status === 'blocked'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                      title={user.account_status === 'blocked' ? 'Ativar usuário' : 'Desativar usuário'}
                    >
                      {user.account_status === 'blocked' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaUsuarios;

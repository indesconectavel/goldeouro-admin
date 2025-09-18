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
      <div className="bg-[#000717] text-white min-h-screen p-8 rounded shadow-md max-w-5xl mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Lista de Usuários</h1>
        <p className="text-gray-400">Ainda não possui dados de usuários cadastrados...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8 rounded shadow-md max-w-7xl mx-auto mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-yellow-400">Lista de Usuários</h1>
        <p className="text-sm text-gray-400">
          Total de usuários cadastrados: {usuarios.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-[#2c3e50] rounded-lg shadow-sm">
          <thead className="bg-[#111827] text-yellow-300 uppercase text-sm">
            <tr>
              <th className="px-4 py-3 border border-[#2c3e50]">Nome</th>
              <th className="px-4 py-3 border border-[#2c3e50]">E-mail</th>
              <th className="px-4 py-3 border border-[#2c3e50]">Status</th>
              <th className="px-4 py-3 border border-[#2c3e50]">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="text-center hover:bg-[#1a2a3d] text-sm transition">
                <td className="px-4 py-2 border border-[#2c3e50] font-medium">{user.name}</td>
                <td className="px-4 py-2 border border-[#2c3e50]">{user.email}</td>
                <td className="px-4 py-2 border border-[#2c3e50]">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      user.account_status === 'blocked'
                        ? 'bg-red-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {user.account_status === 'blocked' ? 'Bloqueado' : 'Ativo'}
                  </span>
                </td>
                <td className="px-4 py-2 border border-[#2c3e50]">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
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

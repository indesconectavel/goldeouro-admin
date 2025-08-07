import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const UsuariosBloqueados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBloqueados = async () => {
    try {
      const response = await api.post('/admin/usuarios-bloqueados', {});
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários bloqueados:', error);
    } finally {
      setLoading(false);
    }
  };

  const desbloquearUsuario = async (id) => {
    try {
      await api.post('/admin/desbloquear-usuario', { userId: id });
      fetchBloqueados(); // Atualiza lista após desbloqueio
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error);
    }
  };

  useEffect(() => {
    fetchBloqueados();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-background text-foreground p-8 min-h-screen">
      <div className="bg-card p-6 rounded shadow-md max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">Usuários Bloqueados</h1>
        </div>

        {usuarios.length === 0 ? (
          <p className="text-muted-foreground text-center mt-10 text-sm">
            Nenhum usuário bloqueado no momento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-border rounded-lg shadow-sm">
              <thead className="bg-[#111827] text-yellow-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 border border-border">Nome</th>
                  <th className="px-4 py-3 border border-border">E-mail</th>
                  <th className="px-4 py-3 border border-border">Status</th>
                  <th className="px-4 py-3 border border-border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="text-center hover:bg-muted/30 text-sm transition">
                    <td className="px-4 py-2 border border-border font-medium">{usuario.name}</td>
                    <td className="px-4 py-2 border border-border">{usuario.email}</td>
                    <td className="px-4 py-2 border border-border text-red-500 font-bold">Bloqueado</td>
                    <td className="px-4 py-2 border border-border">
                      <button
                        onClick={() => desbloquearUsuario(usuario.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                      >
                        Desbloquear
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosBloqueados;

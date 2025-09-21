import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import UsuariosBloqueados from './UsuariosBloqueados';

const UsuariosBloqueadosResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <UsuariosBloqueados />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_USUARIOS_BLOQUEADOS"
      fallback={<UsuariosBloqueados />}
      desktopFallback={<UsuariosBloqueados />}
    >
      <UsuariosBloqueadosMobileTablet />
    </ResponsiveWrapper>
  );
};

const UsuariosBloqueadosMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
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

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-yellow-400 mb-2">Usuários Bloqueados</h1>
            <p className="text-gray-400 text-sm">Gerencie usuários bloqueados no sistema</p>
          </div>

          {usuarios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Nenhum usuário bloqueado no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">B</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{usuario.name}</h3>
                        <p className="text-gray-400 text-sm">{usuario.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-semibold">
                        Bloqueado
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => desbloquearUsuario(usuario.id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition-colors"
                    >
                      Desbloquear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tablet: Layout em tabela
  return (
    <div className="bg-[#000717] text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Usuários Bloqueados</h1>
          <p className="text-gray-400 text-lg">Gerencie usuários bloqueados no sistema</p>
        </div>

        {usuarios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum usuário bloqueado no momento.</p>
          </div>
        ) : (
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">NOME</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">E-MAIL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-[#2c3e50]">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-medium">
                        {usuario.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {usuario.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-semibold">
                          Bloqueado
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => desbloquearUsuario(usuario.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
                        >
                          Desbloquear
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosBloqueadosResponsive;

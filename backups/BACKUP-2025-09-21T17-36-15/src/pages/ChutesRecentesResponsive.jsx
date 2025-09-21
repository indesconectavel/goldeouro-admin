// src/pages/ChutesRecentesResponsive.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import PageTitle from '../components/PageTitle';
import ChutesRecentes from './ChutesRecentes';

const ChutesRecentesResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <ChutesRecentes />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_CHUTES_RECENTES"
      fallback={<ChutesRecentes />}
      desktopFallback={<ChutesRecentes />}
    >
      <ChutesRecentesMobileTablet />
    </ResponsiveWrapper>
  );
};

const ChutesRecentesMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  const [chutes, setChutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados fictícios para fallback
  const mockChutes = [
    { id: 1, user_id: 101, shot_choice: 'Esquerda', was_goal: true, shot_date: '2025-09-07T15:30:00Z' },
    { id: 2, user_id: 102, shot_choice: 'Centro', was_goal: false, shot_date: '2025-09-07T15:25:00Z' },
    { id: 3, user_id: 103, shot_choice: 'Direita', was_goal: true, shot_date: '2025-09-07T15:20:00Z' },
    { id: 4, user_id: 104, shot_choice: 'Esquerda', was_goal: false, shot_date: '2025-09-07T15:15:00Z' },
    { id: 5, user_id: 105, shot_choice: 'Centro', was_goal: true, shot_date: '2025-09-07T15:10:00Z' },
    { id: 6, user_id: 106, shot_choice: 'Direita', was_goal: false, shot_date: '2025-09-07T15:05:00Z' },
    { id: 7, user_id: 107, shot_choice: 'Esquerda', was_goal: true, shot_date: '2025-09-07T15:00:00Z' },
    { id: 8, user_id: 108, shot_choice: 'Centro', was_goal: false, shot_date: '2025-09-07T14:55:00Z' }
  ];

  useEffect(() => {
    async function fetchChutes() {
      try {
        const { data } = await api.post('/admin/chutes-recentes', {});
        setChutes(data || mockChutes);
      } catch (error) {
        console.error('Erro ao buscar chutes recentes:', error?.message);
        setChutes(mockChutes);
      } finally {
        setLoading(false);
      }
    }
    fetchChutes();
  }, []);

  if (loading) return <Loader />;

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <PageTitle>⚽ Chutes Recentes</PageTitle>
            <p className="text-gray-400 text-sm">Listagem dos últimos chutes realizados</p>
          </div>

          {chutes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Ainda não há chutes registrados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chutes.map((c) => (
                <div key={c.id} className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.was_goal ? 'bg-green-500' : 'bg-red-500'}`}>
                        <span className="text-white font-bold text-sm">⚽</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm">Usuário #{c.user_id}</h3>
                        <p className="text-gray-400 text-xs">Direção: {c.shot_choice || '-'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.was_goal ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {c.was_goal ? 'Gol' : 'Errou'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-gray-400 text-xs">
                      {new Date(c.shot_date).toLocaleString('pt-BR')}
                    </span>
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
    <div className="bg-[#000717] text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <PageTitle>⚽ Chutes Recentes</PageTitle>
          <p className="text-gray-400 text-lg">Listagem dos últimos chutes realizados nas partidas</p>
        </div>

        {chutes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Ainda não há chutes registrados.</p>
          </div>
        ) : (
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">USUÁRIO (ID)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">DIREÇÃO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">RESULTADO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">DATA</th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-[#2c3e50]">
                  {chutes.map((c) => (
                    <tr key={c.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-medium">
                        #{c.user_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {c.shot_choice || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.was_goal ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {c.was_goal ? 'Gol' : 'Errou'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                        {new Date(c.shot_date).toLocaleString('pt-BR')}
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

export default ChutesRecentesResponsive;

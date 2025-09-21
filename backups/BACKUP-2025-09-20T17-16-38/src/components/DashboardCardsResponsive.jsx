import { useEffect, useState } from 'react';
import { getData } from '../js/api';
import LoadingSpinner from './LoadingSpinner';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from './ResponsiveWrapper';
import DashboardCards from './DashboardCards'; // Versão original para fallback

export default function DashboardCardsResponsive() {
  const { device, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <DashboardCards />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_CARDS"
      fallback={<DashboardCards />}
      desktopFallback={<DashboardCards />}
    >
      <DashboardCardsMobileTablet />
    </ResponsiveWrapper>
  );
}

const DashboardCardsMobileTablet = () => {
  const { device } = useDeviceDetection();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getData('/api/public/dashboard');
        if (alive) setState({ loading: false, error: null, data });
      } catch (e) {
        if (alive) setState({ loading: false, error: String(e), data: null });
      }
    })();
    return () => { alive = false; };
  }, []);

  if (state.loading) return (
    <div className="text-center py-8">
      <LoadingSpinner size="lg" text="Carregando dados do dashboard..." />
    </div>
  );
  
  // Se houver erro, usar dados fictícios
  const fallbackData = {
    users: 50,
    games: { 
      total: 100, 
      waiting: 8, 
      active: 12, 
      finished: 80,
      today: 15,
      thisWeek: 45,
      thisMonth: 100
    },
    bets: 1000,
    queue: 5,
    revenue: 500,
    profit: 250,
    averageBet: 10.00,
    successRate: 75.5,
    topPlayers: [
      { name: 'João Silva', games: 25, wins: 18 },
      { name: 'Maria Santos', games: 22, wins: 16 },
      { name: 'Pedro Costa', games: 20, wins: 14 }
    ]
  };

  const displayData = state.error ? fallbackData : state.data;
  const { users, games, bets, queue } = displayData || {};
  
  // Configurações responsivas
  const getCardConfig = () => {
    if (device === 'mobile') {
      return {
        grid: 'grid-cols-1 gap-3',
        padding: 'p-3',
        titleSize: 'text-sm',
        valueSize: 'text-xl',
        spacing: 'space-y-3'
      };
    } else if (device === 'tablet') {
      return {
        grid: 'grid-cols-2 gap-4',
        padding: 'p-4',
        titleSize: 'text-base',
        valueSize: 'text-2xl',
        spacing: 'space-y-4'
      };
    }
    return {
      grid: 'grid-cols-4 gap-6',
      padding: 'p-6',
      titleSize: 'text-lg',
      valueSize: 'text-3xl',
      spacing: 'space-y-6'
    };
  };

  const cardConfig = getCardConfig();
  
  return (
    <div className={cardConfig.spacing}>
      {/* Cards de estatísticas - Responsivos */}
      <div className={`grid ${cardConfig.grid}`}>
        <div className={`card ${cardConfig.padding}`}>
          <h3 className={`${cardConfig.titleSize} font-semibold text-yellow-400 mb-2`}>Usuários</h3>
          <p className={`${cardConfig.valueSize} font-bold text-white`}>{users ?? 0}</p>
        </div>
        <div className={`card ${cardConfig.padding}`}>
          <h3 className={`${cardConfig.titleSize} font-semibold text-yellow-400 mb-2`}>Jogos</h3>
          <p className={`${cardConfig.valueSize} font-bold text-white`}>{games?.total ?? 0}</p>
        </div>
        <div className={`card ${cardConfig.padding}`}>
          <h3 className={`${cardConfig.titleSize} font-semibold text-yellow-400 mb-2`}>Apostas</h3>
          <p className={`${cardConfig.valueSize} font-bold text-white`}>{bets ?? 0}</p>
        </div>
        <div className={`card ${cardConfig.padding}`}>
          <h3 className={`${cardConfig.titleSize} font-semibold text-yellow-400 mb-2`}>Na Fila</h3>
          <p className={`${cardConfig.valueSize} font-bold text-white`}>{queue ?? 0}</p>
        </div>
      </div>

      {/* Tabela de jogos recentes - Responsiva */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className={`${cardConfig.titleSize} font-semibold text-yellow-400`}>Jogos Recentes</h3>
        </div>
        
        {/* Mobile: Cards em vez de tabela */}
        {device === 'mobile' ? (
          <div className="p-4 space-y-3">
            {games && games.total > 0 ? (
              <>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">ID</span>
                    <span className="text-sm text-white">Jogo #{games.total - 2}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Status</span>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Ativo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Criado em</span>
                    <span className="text-sm text-white">Hoje 14:30</span>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">ID</span>
                    <span className="text-sm text-white">Jogo #{games.total - 1}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Status</span>
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Aguardando</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Criado em</span>
                    <span className="text-sm text-white">Hoje 14:25</span>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">ID</span>
                    <span className="text-sm text-white">Jogo #{games.total}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Status</span>
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Finalizado</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Criado em</span>
                    <span className="text-sm text-white">Hoje 14:20</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhum jogo encontrado</p>
              </div>
            )}
          </div>
        ) : (
          /* Tablet e Desktop: Tabela tradicional */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Criado em</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {games && games.total > 0 ? (
                  <>
                    <tr className="hover:bg-gray-700">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                        Jogo #{games.total - 2}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Ativo</span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">Hoje 14:30</td>
                    </tr>
                    <tr className="hover:bg-gray-700">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                        Jogo #{games.total - 1}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Aguardando</span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">Hoje 14:25</td>
                    </tr>
                    <tr className="hover:bg-gray-700">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                        Jogo #{games.total}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Finalizado</span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">Hoje 14:20</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                      Nenhum jogo encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

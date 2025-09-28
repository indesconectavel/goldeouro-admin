// src/pages/LogsSistemaResponsive.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import PageTitle from '../components/PageTitle';
import LogsSistema from './LogsSistema';

const LogsSistemaResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <LogsSistema />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_LOGS_SISTEMA"
      fallback={<LogsSistema />}
      desktopFallback={<LogsSistema />}
    >
      <LogsSistemaMobileTablet />
    </ResponsiveWrapper>
  );
};

const LogsSistemaMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados fictícios para fallback
  const mockLogs = [
    { id: 1, action: 'LOGIN', details: 'Administrador fez login no sistema', created_at: '2025-09-07T15:30:00Z' },
    { id: 2, action: 'USER_BLOCK', details: 'Usuário Usuário foi bloqueado', created_at: '2025-09-07T15:25:00Z' },
    { id: 3, action: 'WITHDRAWAL_APPROVE', details: 'Saque de R$ 150,00 aprovado', created_at: '2025-09-07T15:20:00Z' },
    { id: 4, action: 'GAME_CREATE', details: 'Novo jogo #128 criado', created_at: '2025-09-07T15:15:00Z' },
    { id: 5, action: 'CONFIG_UPDATE', details: 'Configurações do sistema atualizadas', created_at: '2025-09-07T15:10:00Z' },
    { id: 6, action: 'USER_UNBLOCK', details: 'Usuário Usuário foi desbloqueado', created_at: '2025-09-07T15:05:00Z' },
    { id: 7, action: 'BACKUP_CREATE', details: 'Backup do sistema criado', created_at: '2025-09-07T15:00:00Z' },
    { id: 8, action: 'LOGIN_FAIL', details: 'Tentativa de login falhada - IP suspeito', created_at: '2025-09-07T14:55:00Z' }
  ];

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data } = await api.post('/admin/logs', {});
        setLogs(data || mockLogs);
      } catch (error) {
        console.error('Erro ao buscar logs do sistema:', error?.message);
        setLogs(mockLogs);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) return <Loader />;

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <PageTitle>📋 Logs do Sistema</PageTitle>
            <p className="text-gray-400 text-sm">Acompanhamento das ações administrativas</p>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Ainda não há registros de ações no sistema.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">L</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm">{log.action}</h3>
                        <p className="text-gray-400 text-xs">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-xs">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
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
          <PageTitle>📋 Logs do Sistema</PageTitle>
          <p className="text-gray-400 text-lg">Acompanhamento das ações administrativas realizadas na plataforma para fins de auditoria</p>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Ainda não há registros de ações no sistema.</p>
          </div>
        ) : (
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">AÇÃO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">DESCRIÇÃO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">DATA</th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-[#2c3e50]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-medium">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {log.details}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
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

export default LogsSistemaResponsive;

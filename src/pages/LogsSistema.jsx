import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

export default function LogsSistema() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await postData('/admin/logs', {});
        setLogs(response || []);
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
        // Dados fictícios como fallback
        setLogs([
          {
            id: 1,
            action: 'LOGIN',
            details: 'Usuário admin fez login no sistema',
            created_at: '2025-01-17T14:30:00Z',
            level: 'info'
          },
          {
            id: 2,
            action: 'USER_CREATE',
            details: 'Novo usuário Usuário foi criado',
            created_at: '2025-01-17T14:25:00Z',
            level: 'info'
          },
          {
            id: 3,
            action: 'GAME_START',
            details: 'Partida #1001 foi iniciada',
            created_at: '2025-01-17T14:20:00Z',
            level: 'info'
          },
          {
            id: 4,
            action: 'PAYMENT',
            details: 'Pagamento de R$ 50,00 processado para usuário Usuário',
            created_at: '2025-01-17T14:15:00Z',
            level: 'info'
          },
          {
            id: 5,
            action: 'ERROR',
            details: 'Erro ao conectar com banco de dados',
            created_at: '2025-01-17T14:10:00Z',
            level: 'error'
          },
          {
            id: 6,
            action: 'BACKUP',
            details: 'Backup automático executado com sucesso',
            created_at: '2025-01-17T14:05:00Z',
            level: 'info'
          },
          {
            id: 7,
            action: 'WARNING',
            details: 'Uso de memória alto detectado (85%)',
            created_at: '2025-01-17T14:00:00Z',
            level: 'warning'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando logs do sistema..." />;
  }

  if (logs.length === 0) {
    return <EmptyState message="Ainda não há registros de ações no sistema." />;
  }

  const totalLogs = logs.length;
  const logsInfo = logs.filter(log => log.level === 'info').length;
  const logsWarning = logs.filter(log => log.level === 'warning').length;
  const logsError = logs.filter(log => log.level === 'error').length;

  const getLevelBadge = (level) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (level) {
      case 'info':
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>INFO</span>;
      case 'warning':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>WARN</span>;
      case 'error':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>ERROR</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>DEBUG</span>;
    }
  };

  const tableColumns = [
    { 
      key: 'level', 
      header: 'Nível',
      render: (log) => getLevelBadge(log.level)
    },
    { key: 'action', header: 'Ação' },
    { key: 'details', header: 'Descrição' },
    { 
      key: 'created_at', 
      header: 'Data',
      render: (log) => new Date(log.created_at).toLocaleString('pt-BR')
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Logs do Sistema</h1>
      <p className="text-gray-300 mb-6">
        Acompanhamento das ações administrativas realizadas na plataforma para fins de auditoria.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Logs" 
          value={totalLogs} 
          color="yellow" 
        />
        <CardTemplate 
          title="Informações" 
          value={logsInfo} 
          color="blue" 
        />
        <CardTemplate 
          title="Avisos" 
          value={logsWarning} 
          color="orange" 
        />
        <CardTemplate 
          title="Erros" 
          value={logsError} 
          color="red" 
        />
      </GridTemplate>

      {/* Tabela de Logs */}
      <TableTemplate 
        title="Histórico de Logs"
        columns={tableColumns}
        data={logs}
      />

      {/* Estatísticas por Tipo de Ação */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Estatísticas por Tipo de Ação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['LOGIN', 'USER_CREATE', 'GAME_START', 'PAYMENT'].map(acao => {
            const logsAcao = logs.filter(log => log.action === acao).length;
            
            return (
              <div key={acao} className="text-center">
                <h3 className="text-white font-semibold mb-2">{acao.replace('_', ' ')}</h3>
                <p className="text-2xl font-bold text-yellow-400">{logsAcao}</p>
                <p className="text-sm text-gray-400">ocorrências</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do Sistema de Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Período de Retenção:</span>
              <span className="text-white font-semibold">30 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Nível de Log:</span>
              <span className="text-white font-semibold">INFO e superior</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Última Atualização:</span>
              <span className="text-white font-semibold">
                {new Date().toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="text-green-400 font-semibold">Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
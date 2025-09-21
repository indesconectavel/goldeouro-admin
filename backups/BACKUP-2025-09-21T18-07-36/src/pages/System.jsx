import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const System = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSystemInfo() {
      try {
        const result = await postData('/admin/system-info', {});
        setSystemInfo(result);
      } catch (error) {
        console.error('Erro ao buscar informações do sistema:', error);
        // Dados fictícios como fallback
        setSystemInfo({
          status: 'online',
          uptime: '2h 30m',
          memory: {
            used: 45,
            total: 100
          },
          cpu: 25,
          disk: {
            used: 60,
            total: 100
          }
        });
      } finally {
        setLoading(false);
      }
    }

    async function fetchLogs() {
      try {
        const result = await postData('/admin/system-logs', {});
        setLogs(result || []);
      } catch (error) {
        console.error('Erro ao buscar logs do sistema:', error);
        // Dados fictícios como fallback
        setLogs([
          {
            id: 1,
            level: 'info',
            message: 'Sistema iniciado com sucesso',
            timestamp: '2025-01-17T14:00:00Z'
          },
          {
            id: 2,
            level: 'warning',
            message: 'Uso de memória alto detectado',
            timestamp: '2025-01-17T13:45:00Z'
          },
          {
            id: 3,
            level: 'error',
            message: 'Falha na conexão com banco de dados',
            timestamp: '2025-01-17T13:30:00Z'
          }
        ]);
      }
    }

    fetchSystemInfo();
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando informações do sistema...</div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case 'online':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Online</span>;
      case 'offline':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Offline</span>;
      case 'maintenance':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Manutenção</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
  };

  const getLogLevelBadge = (level) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (level) {
      case 'info':
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>Info</span>;
      case 'warning':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Warning</span>;
      case 'error':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Error</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Unknown</span>;
    }
  };

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'level', 
      header: 'Nível',
      render: (log) => getLogLevelBadge(log.level)
    },
    { key: 'message', header: 'Mensagem' },
    { 
      key: 'timestamp', 
      header: 'Data/Hora',
      render: (log) => new Date(log.timestamp).toLocaleString("pt-BR")
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Sistema</h1>
      <p className="text-gray-300 mb-6">
        Monitoramento e informações do sistema.
      </p>

      {/* Status do Sistema */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Status do Sistema</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Status:</span>
          {getStatusBadge(systemInfo?.status || 'unknown')}
          <span className="text-gray-300">Uptime: {systemInfo?.uptime || 'N/A'}</span>
        </div>
      </div>

      {/* Métricas do Sistema */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="CPU" 
          value={`${systemInfo?.cpu || 0}%`} 
          color="blue" 
        />
        <CardTemplate 
          title="Memória" 
          value={`${systemInfo?.memory?.used || 0}%`} 
          color="yellow" 
        />
        <CardTemplate 
          title="Disco" 
          value={`${systemInfo?.disk?.used || 0}%`} 
          color="red" 
        />
        <CardTemplate 
          title="Status" 
          value={systemInfo?.status || 'unknown'} 
          color={systemInfo?.status === 'online' ? 'green' : 'red'} 
        />
      </GridTemplate>

      {/* Logs do Sistema */}
      <TableTemplate 
        title="Logs do Sistema"
        columns={tableColumns}
        data={logs}
      />
    </div>
  );
};

export default System;
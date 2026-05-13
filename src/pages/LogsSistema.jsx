import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';

export default function LogsSistema() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError('');
      try {
        const result = await getData('/api/admin/audit/logs?limit=100');
        if (!result?.success || !Array.isArray(result.data)) {
          throw new Error(result?.message || 'Resposta inválida da API de auditoria');
        }
        const mapped = result.data.map((row) => ({
          id: row.id,
          level: 'info',
          action: row.action || '—',
          details:
            typeof row.metadata === 'object' && row.metadata !== null
              ? JSON.stringify(row.metadata)
              : String(row.metadata || '—'),
          created_at: row.created_at,
          admin_id: row.admin_id,
          ip: row.ip
        }));
        setLogs(mapped);
      } catch (e) {
        console.error('Erro ao buscar logs:', e);
        setLogs([]);
        setError(e?.message || 'Não foi possível carregar os registros de auditoria.');
      } finally {
        setLoading(false);
      }
    }

    void fetchLogs();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando registros de auditoria..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Logs administrativos</h1>
        <p className="text-gray-400 text-sm mb-4">
          Esta página lista as entradas persistidas em <code className="text-yellow-200/90">admin_logs</code> (mesma
          fonte da tela de Auditoria).
        </p>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
        <Link to="/auditoria" className="text-yellow-300 hover:underline text-sm">
          Abrir tela de Auditoria com filtros
        </Link>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Logs administrativos</h1>
        <p className="text-gray-400">Nenhum registro retornado para o limite atual.</p>
      </div>
    );
  }

  const totalLogs = logs.length;
  const logsInfo = logs.filter((log) => log.level === 'info').length;
  const logsWarning = logs.filter((log) => log.level === 'warning').length;
  const logsError = logs.filter((log) => log.level === 'error').length;

  const getLevelBadge = (level) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold';
    switch (level) {
      case 'info':
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>INFO</span>;
      case 'warning':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>WARN</span>;
      case 'error':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>ERROR</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>LOG</span>;
    }
  };

  const tableColumns = [
    {
      key: 'level',
      header: 'Nível',
      render: (log) => getLevelBadge(log.level)
    },
    { key: 'action', header: 'Ação' },
    {
      key: 'details',
      header: 'Metadados',
      render: (log) => <span className="text-xs break-all text-gray-200">{log.details}</span>
    },
    {
      key: 'created_at',
      header: 'Data',
      render: (log) => new Date(log.created_at).toLocaleString('pt-BR')
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Logs administrativos</h1>
      <p className="text-gray-300 mb-4 text-sm">
        Fonte: <code className="text-yellow-200/90">GET /api/admin/audit/logs</code> (tabela <code>admin_logs</code>).
      </p>

      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate title="Total de registros" value={totalLogs} color="yellow" />
        <CardTemplate title="Marcados INFO" value={logsInfo} color="blue" />
        <CardTemplate title="WARN" value={logsWarning} color="orange" />
        <CardTemplate title="ERROR" value={logsError} color="red" />
      </GridTemplate>

      <TableTemplate title="Histórico" columns={tableColumns} data={logs} />
    </div>
  );
}

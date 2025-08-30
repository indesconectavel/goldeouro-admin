// src/pages/LogsSistema.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

export default function LogsSistema() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data } = await api.post('/admin/logs', {});
        setLogs(data || []);
      } catch (error) {
        console.error('Erro ao buscar logs do sistema:', error?.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-6 rounded shadow-md max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Logs do Sistema</h1>
        <p className="text-muted-foreground mb-6">
          Acompanhamento das ações administrativas realizadas na plataforma para fins de auditoria.
        </p>

        {logs.length === 0 ? (
          <div className="text-center text-sm text-gray-400 mt-20">
            Ainda não há registros de ações no sistema.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-border rounded-lg shadow-sm text-sm">
              <thead className="bg-[#111827] text-yellow-300 uppercase">
                <tr>
                  <th className="px-4 py-3 border border-border">Ação</th>
                  <th className="px-4 py-3 border border-border">Descrição</th>
                  <th className="px-4 py-3 border border-border">Data</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="text-center hover:bg-muted/30">
                    <td className="px-4 py-2 border border-border font-medium">{log.action}</td>
                    <td className="px-4 py-2 border border-border">{log.details}</td>
                    <td className="px-4 py-2 border border-border">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
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
}

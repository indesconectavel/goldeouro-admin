import React, { useEffect, useState, useCallback } from 'react';
import { getData } from '../js/api';
import TableTemplate from '../templates/TableTemplate';

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR');
};

const formatMetadata = (meta) => {
  try {
    if (meta == null) {
      return JSON.stringify(meta, null, 2);
    }
    if (typeof meta === 'object') {
      return JSON.stringify(meta, null, 2);
    }
    if (typeof meta === 'string') {
      const t = meta.trim();
      if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
        try {
          return JSON.stringify(JSON.parse(t), null, 2);
        } catch {
          return JSON.stringify(meta, null, 2);
        }
      }
      return JSON.stringify(meta, null, 2);
    }
    return JSON.stringify(meta, null, 2);
  } catch (_) {
    return '—';
  }
};

const Auditoria = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [listVersion, setListVersion] = useState(0);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      const trimmed = actionFilter.trim();
      if (trimmed) {
        params.set('action', trimmed);
      }
      const result = await getData(`/api/admin/audit/logs?${params.toString()}`);
      if (!result?.success) {
        throw new Error(result?.message || 'Falha ao listar auditoria');
      }
      const data = Array.isArray(result.data) ? result.data : [];
      const sorted = [...data].sort((a, b) => {
        const ta = new Date(a?.created_at || 0).getTime();
        const tb = new Date(b?.created_at || 0).getTime();
        return tb - ta;
      });
      setRows(sorted);
    } catch (e) {
      console.error('Erro ao buscar auditoria:', e);
      setError(e?.message || 'Erro ao carregar auditoria');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, listVersion]);

  useEffect(() => {
    const delayMs = actionFilter.trim() ? 400 : 0;
    const handle = setTimeout(() => {
      void loadLogs();
    }, delayMs);
    return () => clearTimeout(handle);
  }, [actionFilter, listVersion, loadLogs]);

  const bumpList = () => setListVersion((v) => v + 1);

  const tableColumns = [
    { key: 'action', header: 'Ação' },
    { key: 'admin_id', header: 'Admin (id)' },
    {
      key: 'target_type',
      header: 'Alvo (tipo)',
      render: (r) => (r.target_type != null ? String(r.target_type) : '—')
    },
    {
      key: 'target_id',
      header: 'Alvo (id)',
      render: (r) => (r.target_id != null ? String(r.target_id) : '—')
    },
    {
      key: 'ip',
      header: 'IP',
      render: (r) => (r.ip != null && String(r.ip).trim() !== '' ? String(r.ip) : '—')
    },
    {
      key: 'created_at',
      header: 'Data/Hora',
      render: (r) => formatDate(r.created_at)
    },
    {
      key: 'metadata',
      header: 'Metadata',
      render: (r) => (
        <pre className="max-w-xs md:max-w-lg max-h-36 overflow-auto text-left text-xs font-mono whitespace-pre-wrap bg-black/25 text-gray-200 p-2 rounded border border-white/10">
          {formatMetadata(r.metadata)}
        </pre>
      )
    }
  ];

  const showInitialSpinner = loading && rows.length === 0 && !error;

  if (showInitialSpinner) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando auditoria...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Auditoria administrativa</h1>
      <p className="text-gray-300 mb-2">Registos persistidos de ações administrativas (últimos 50 por pedido).</p>
      <p className="text-xs text-gray-500 mb-6">
        Dados reais via <code className="text-yellow-200/90">GET /api/admin/audit/logs</code>. Ordenação por data
        (mais recente primeiro). Filtro por <code className="text-yellow-200/90">action</code> corresponde ao valor
        exato no servidor.
      </p>

      {error ? (
        <div className="text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">{error}</div>
      ) : null}

      {loading && rows.length > 0 ? (
        <div className="text-center text-yellow-400 text-sm">Atualizando lista...</div>
      ) : null}

      <div className="card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1 max-w-md">
            <label className="block text-xs text-gray-400 mb-1">Filtrar por ação (ex.: user.block)</label>
            <input
              type="text"
              placeholder="Deixe vazio para todas"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <button
            type="button"
            onClick={() => bumpList()}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>

      {!loading && !error && rows.length === 0 ? (
        <div className="text-center text-gray-400 py-8 border border-zinc-700 rounded">
          Nenhum registro de auditoria encontrado.
        </div>
      ) : null}

      {!error && rows.length > 0 ? (
        <TableTemplate title="Registos de auditoria" columns={tableColumns} data={rows} />
      ) : null}
    </div>
  );
};

export default Auditoria;

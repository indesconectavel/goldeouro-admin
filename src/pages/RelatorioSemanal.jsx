import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RelatorioSemanal = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Relatório semanal</h1>
      <div className="p-4 rounded bg-amber-500/15 border border-amber-500/40 text-amber-100 text-sm space-y-3">
        <p>
          Não existe endpoint <code className="text-yellow-200/90">/api/admin/…</code> para relatório semanal agregado
          nesta versão do backend. Dados fictícios foram removidos.
        </p>
        <p>
          Use o{' '}
          <Link to="/relatorio-geral" className="text-yellow-300 underline">
            relatório geral (parcial)
          </Link>{' '}
          ou o{' '}
          <Link to="/relatorio-financeiro" className="text-yellow-300 underline">
            relatório financeiro
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RelatorioSemanal;

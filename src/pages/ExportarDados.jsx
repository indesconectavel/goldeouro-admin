import React, { useEffect, useState } from 'react';

const ExportarDados = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Exportar dados</h1>
      <div className="p-4 rounded bg-amber-500/15 border border-amber-500/40 text-amber-100 text-sm space-y-3">
        <p>
          As rotas legadas <code className="text-yellow-200/90">/admin/dados-exportacao</code> e{' '}
          <code className="text-yellow-200/90">/admin/exportar/…</code> não existem no runtime Fly. Contagens fictícias
          e abertura de URL sem token foram removidas.
        </p>
        <p>
          Exportações CSV/PDF exigem desenho de endpoint autenticado (ex.: download com Bearer) — fora do escopo desta
          cirurgia.
        </p>
      </div>
    </div>
  );
};

export default ExportarDados;

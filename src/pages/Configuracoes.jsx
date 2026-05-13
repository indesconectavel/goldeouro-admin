import React, { useEffect, useState } from 'react';

const Configuracoes = () => {
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
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Configurações</h1>
      <div className="p-4 rounded bg-amber-500/15 border border-amber-500/40 text-amber-100 text-sm">
        Não há endpoints <code className="text-yellow-200/90">/api/admin/configuracoes</code> no backend atual. Valores
        fictícios e gravação simulada foram removidos. Ajustes de produção continuam via variáveis de ambiente e
        console do provedor.
      </div>
    </div>
  );
};

export default Configuracoes;

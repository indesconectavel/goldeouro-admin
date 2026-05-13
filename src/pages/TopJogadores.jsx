import React, { useEffect, useState } from 'react';

const TopJogadores = () => {
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
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Top jogadores</h1>
      <div className="p-4 rounded bg-amber-500/15 border border-amber-500/40 text-amber-100 text-sm">
        Não existe endpoint <code className="text-yellow-200/90">/api/admin/top-jogadores</code> (ou equivalente) no
        backend atual. A lista vazia anterior podia sugerir ausência de dados; aqui o estado é explícito: funcionalidade
        não disponível.
      </div>
    </div>
  );
};

export default TopJogadores;

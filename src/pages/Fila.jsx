import { useEffect, useState } from 'react';

export default function Fila() {
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
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Fila de chute</h1>
      <div className="p-4 rounded bg-amber-500/15 border border-amber-500/40 text-amber-100 text-sm">
        Não há endpoint administrativo público para monitorizar a fila global nesta versão do backend. A chamada
        legada <code className="text-yellow-200/90">POST /fila/status</code> foi descontinuada no painel; dados
        simulados foram removidos.
      </div>
    </div>
  );
}

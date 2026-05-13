import React, { useEffect, useState } from 'react';

const Backup = () => {
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
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Backup</h1>
      <div className="p-4 rounded bg-amber-500/15 border border-amber-500/40 text-amber-100 text-sm">
        Não há endpoints <code className="text-yellow-200/90">/api/admin/backup-*</code> no backend Fly atual. Dados
        simulados de backups foram removidos. Operações de backup devem ser feitas fora deste painel (ex.: política
        Supabase / provedor).
      </div>
    </div>
  );
};

export default Backup;

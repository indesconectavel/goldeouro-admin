import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Backup = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBackupStatus() {
      try {
        const response = await api.post("/admin/backup-status", {});
        setStatus(response.data);
      } catch (error) {
        console.error("Erro ao buscar status de backup:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBackupStatus();
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Backup e Segurança</h1>
        <p className="text-muted-foreground mb-6">
          Status dos backups automáticos e integridade dos dados do sistema.
        </p>

        {loading ? (
          <Loader />
        ) : !status ? (
          <div className="text-center text-gray-400 mt-12">
            Ainda não há dados disponíveis sobre o status de backup.
          </div>
        ) : (
          <div className="space-y-4 text-sm sm:text-base">
            <p><strong>Último backup:</strong> {status.ultimo_backup || 'Não disponível'}</p>
            <p><strong>Status:</strong> {status.status || 'Não disponível'}</p>
            <p><strong>Arquivos incluídos:</strong> {status.total_arquivos || '0'} arquivos</p>
            <p><strong>Observações:</strong> {status.observacoes || 'Nenhuma'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Backup;

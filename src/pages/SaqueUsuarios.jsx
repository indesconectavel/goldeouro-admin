import React, { useState, useEffect } from 'react';
import { getData, postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const PIX_SEND_CONFIRM_MESSAGE =
  'Esta ação enviará um PIX real ao jogador. Deseja continuar?';

const SaqueUsuarios = () => {
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchSaques = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getData('/api/admin/withdraw/list?limit=50');
      if (!result?.success) {
        throw new Error(result?.message || 'Falha ao listar saques');
      }
      setSaques(Array.isArray(result.data) ? result.data : []);
    } catch (e) {
      console.error('Erro ao buscar saques:', e);
      setError(e?.message || 'Erro ao carregar saques');
      setSaques([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaques();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold';
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'pendente' || normalized === 'pending') {
      return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Pendente</span>;
    }
    if (normalized === 'processando' || normalized === 'processing') {
      return <span className={`${baseClasses} bg-amber-500/20 text-amber-300`}>Processando</span>;
    }
    if (normalized === 'aguardando_confirmacao') {
      return <span className={`${baseClasses} bg-blue-500/20 text-blue-300`}>Aguardando PIX</span>;
    }
    if (normalized === 'processado') {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>PIX confirmado</span>;
    }
    if (normalized.includes('pago')) {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Pago</span>;
    }
    if (normalized.includes('cancel')) {
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Cancelado</span>;
    }
    return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>{status || 'Desconhecido'}</span>;
  };

  const getLedgerStateBadge = (ledgerState) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold';
    switch (ledgerState) {
      case 'COMPENSATED':
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-300`}>COMPENSATED</span>;
      case 'PAYOUT_ONLY':
        return <span className={`${baseClasses} bg-green-500/20 text-green-300`}>PAYOUT_ONLY</span>;
      case 'ROLLBACK_ONLY':
        return <span className={`${baseClasses} bg-orange-500/20 text-orange-300`}>ROLLBACK_ONLY</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-300`}>NONE</span>;
    }
  };

  const isPending = (status) => {
    const s = String(status || '').toLowerCase();
    return s === 'pendente' || s === 'pending';
  };

  const canApproveManual = (saque) => isPending(saque.status) && (saque.ledger_state || 'NONE') === 'NONE';
  const canApproveAndSend = (saque) => canApproveManual(saque);
  const canCancel = (saque) =>
    isPending(saque.status) && !['PAYOUT_ONLY', 'COMPENSATED'].includes(String(saque.ledger_state || 'NONE'));

  const handleApproveManual = async (saqueId) => {
    setActionLoadingId(`approve:${saqueId}`);
    setError('');
    try {
      const result = await postData('/api/admin/withdraw/approve', { saqueId });
      if (!result?.success) throw new Error(result?.message || 'Falha ao confirmar pagamento manual');
      await fetchSaques();
    } catch (e) {
      console.error('Erro ao confirmar PIX manual:', e);
      setError(e?.message || 'Erro ao confirmar pagamento manual');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApproveAndSend = async (saqueId) => {
    if (!window.confirm(PIX_SEND_CONFIRM_MESSAGE)) {
      return;
    }
    setActionLoadingId(`send:${saqueId}`);
    setError('');
    try {
      const result = await postData('/api/admin/withdraw/approve-and-send', { saqueId });
      if (!result?.success) throw new Error(result?.message || 'Falha ao enviar PIX automático');
      await fetchSaques();
    } catch (e) {
      console.error('Erro ao enviar PIX:', e);
      setError(e?.message || 'Erro ao enviar PIX automático');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (saqueId) => {
    setActionLoadingId(`cancel:${saqueId}`);
    setError('');
    try {
      const result = await postData('/api/admin/withdraw/cancel', { saqueId, motivo: 'cancelamento_painel_admin' });
      if (!result?.success) throw new Error(result?.message || 'Falha ao cancelar saque');
      await fetchSaques();
    } catch (e) {
      console.error('Erro ao cancelar saque:', e);
      setError(e?.message || 'Erro ao cancelar saque');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando relatório de saques...</div>
      </div>
    );
  }

  const totalSaques = saques.length;
  const saquesPagos = saques.filter((s) => String(s.status || '').toLowerCase().includes('pago')).length;
  const saquesPendentes = saques.filter((s) => isPending(s.status)).length;
  const valorTotal = saques.reduce((sum, saque) => sum + Number(saque.amount || saque.valor || 0), 0);

  const tableColumns = [
    { key: 'id', header: 'ID' },
    {
      key: 'usuario',
      header: 'Usuário',
      render: (saque) => saque?.user?.nome || saque?.user?.email || saque?.usuario_id || '-'
    },
    {
      key: 'amount',
      header: 'Valor',
      render: (saque) => `R$ ${Number(saque.amount || saque.valor || 0).toFixed(2)}`
    },
    {
      key: 'status',
      header: 'Status',
      render: (saque) => getStatusBadge(saque.status)
    },
    {
      key: 'created_at',
      header: 'Data',
      render: (saque) => (saque.created_at ? new Date(saque.created_at).toLocaleString('pt-BR') : '-')
    },
    {
      key: 'ledger_state',
      header: 'Ledger',
      render: (saque) => getLedgerStateBadge(saque.ledger_state)
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: (saque) => {
        const approveKey = `approve:${saque.id}`;
        const sendKey = `send:${saque.id}`;
        const cancelKey = `cancel:${saque.id}`;
        const approving = actionLoadingId === approveKey;
        const sending = actionLoadingId === sendKey;
        const cancelling = actionLoadingId === cancelKey;
        const busy = approving || sending || cancelling;
        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApproveManual(saque.id)}
              disabled={!canApproveManual(saque) || busy}
              className="px-2 py-1 bg-green-700 text-white rounded disabled:opacity-50 text-xs"
              title="Use quando o PIX já foi pago fora do sistema"
            >
              {approving ? 'Confirmando...' : 'Confirmar PIX manual'}
            </button>
            <button
              type="button"
              onClick={() => handleApproveAndSend(saque.id)}
              disabled={!canApproveAndSend(saque) || busy}
              className="px-2 py-1 bg-blue-600 text-white rounded disabled:opacity-50 text-xs"
              title="Envia PIX automaticamente via Mercado Pago"
            >
              {sending ? 'Enviando...' : 'Aprovar e Enviar PIX'}
            </button>
            <button
              type="button"
              onClick={() => handleCancel(saque.id)}
              disabled={!canCancel(saque) || busy}
              className="px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50 text-xs"
            >
              {cancelling ? 'Cancelando...' : 'Cancelar'}
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Relatório de Saques</h1>
      </div>

      {error ? (
        <div className="p-3 rounded bg-red-500/20 border border-red-500/40 text-red-300">{error}</div>
      ) : null}

      {!error && saques.length === 0 ? (
        <div className="p-3 rounded bg-white/10 border border-white/20 text-gray-300">
          Nenhum saque encontrado.
        </div>
      ) : null}

      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate title="Total de Saques" value={totalSaques} color="yellow" />
        <CardTemplate title="Pagos" value={saquesPagos} color="green" />
        <CardTemplate title="Pendentes" value={saquesPendentes} color="yellow" />
        <CardTemplate title="Valor Total" value={`R$ ${valorTotal.toFixed(2)}`} color="blue" />
      </GridTemplate>

      <TableTemplate title="Lista de Saques" columns={tableColumns} data={saques} />
    </div>
  );
};

export default SaqueUsuarios;

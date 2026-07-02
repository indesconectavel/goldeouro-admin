import React, { useState, useEffect } from 'react';
import { getData, postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const MANUAL_CONFIRM_MESSAGE =
  'Esta ação NÃO envia PIX automaticamente.\n\n' +
  'Utilize apenas quando o pagamento já tiver sido realizado fora da plataforma.';

const SaqueUsuarios = () => {
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [engine, setEngine] = useState(null);
  const [meta, setMeta] = useState(null);

  const fetchEngine = async () => {
    try {
      const [healthResult, metaResult] = await Promise.all([getData('/health'), getData('/meta')]);
      setEngine(healthResult?.paymentEngine || null);
      setMeta(metaResult?.data || null);
    } catch (e) {
      console.warn('Não foi possível obter provider efetivo:', e);
      setEngine(null);
      setMeta(null);
    }
  };

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
    fetchEngine();
    fetchSaques();
  }, []);

  const payoutProvider = engine?.payoutProvider || null;
  const payoutAutomatic = String(payoutProvider || '').toLowerCase() !== 'mercadopago';

  const badge = (classes, label) => (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${classes}`}>{label}</span>
  );

  const getWithdrawBadge = (saque) => {
    const status = String(saque?.status || '').toLowerCase();
    const ledger = String(saque?.ledger_state || 'NONE');
    const transferStatus = String(saque?.asaas_transfer_status || '').toUpperCase();
    const isManual =
      status.includes('manual') ||
      (ledger === 'PAYOUT_ONLY' && !saque?.asaas_transfer_id && !/(pago|processado)/.test(status));

    if (status.includes('cancel')) return badge('bg-red-500/20 text-red-400', 'Cancelado');
    if (/(falha|fail|erro|rejeit|refus)/.test(status)) {
      return badge('bg-red-500/20 text-red-300', 'Falha');
    }
    if (isManual) return badge('bg-emerald-500/20 text-emerald-300', 'Pago Manualmente');
    if (status.includes('pago') || status === 'processado') {
      return badge('bg-green-500/20 text-green-400', 'Pago');
    }
    if (transferStatus === 'AUTHORIZED' || transferStatus === 'BANK_PROCESSING') {
      return badge('bg-indigo-500/20 text-indigo-300', 'Autorizado');
    }
    if (/(processando|processing|aguardando|enviad)/.test(status) || transferStatus === 'PENDING') {
      return badge('bg-blue-500/20 text-blue-300', 'Enviado');
    }
    if (status === 'pendente' || status === 'pending') {
      return badge('bg-yellow-500/20 text-yellow-400', 'Pendente');
    }
    return badge('bg-gray-500/20 text-gray-400', saque?.status || 'Desconhecido');
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
    if (!window.confirm(MANUAL_CONFIRM_MESSAGE)) {
      return;
    }
    setActionLoadingId(`approve:${saqueId}`);
    setError('');
    try {
      const result = await postData('/api/admin/withdraw/approve', { saqueId });
      if (!result?.success) throw new Error(result?.message || 'Falha ao registrar baixa manual');
      await fetchSaques();
    } catch (e) {
      console.error('Erro ao registrar baixa manual:', e);
      setError(e?.message || 'Erro ao registrar baixa manual');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApproveAndSend = async (saqueId) => {
    const confirmMsg =
      'Esta ação enviará um PIX REAL ao jogador.\n\n' +
      'Confirme apenas se o envio automático deve ser executado agora.';
    if (!window.confirm(confirmMsg)) {
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
      render: (saque) => getWithdrawBadge(saque)
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
              onClick={() => handleApproveAndSend(saque.id)}
              disabled={!canApproveAndSend(saque) || busy}
              className="px-2 py-1 min-h-[36px] bg-blue-600 text-white rounded disabled:opacity-50 text-xs"
              title="Envia PIX real automaticamente ao jogador"
            >
              {sending ? 'Enviando...' : 'Aprovar e Enviar PIX'}
            </button>
            <button
              type="button"
              onClick={() => handleApproveManual(saque.id)}
              disabled={!canApproveManual(saque) || busy}
              className="px-2 py-1 min-h-[36px] bg-emerald-700 text-white rounded disabled:opacity-50 text-xs"
              title="NÃO envia PIX. Apenas registra baixa administrativa de pagamento feito fora da plataforma."
            >
              {approving ? 'Registrando...' : 'Marcar como Pago Manualmente'}
            </button>
            <button
              type="button"
              onClick={() => handleCancel(saque.id)}
              disabled={!canCancel(saque) || busy}
              className="px-2 py-1 min-h-[36px] bg-red-600 text-white rounded disabled:opacity-50 text-xs"
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

      {engine ? (
        <div className="p-3 rounded bg-white/5 border border-white/10 text-sm text-gray-300 flex flex-wrap gap-x-6 gap-y-1">
          <span>
            Envio automático de saque:{' '}
            <strong className={payoutAutomatic ? 'text-green-400' : 'text-slate-300'}>
              {engine?.pixOut?.productionHttpEnabled ? 'ativo' : 'inativo'}
            </strong>
            {!engine?.pixOut?.productionHttpEnabled && engine?.pixOut?.productionBlockReason ? (
              <span className="text-gray-500 ml-1">({engine.pixOut.productionBlockReason})</span>
            ) : null}
          </span>
          <span>
            Ambiente:{' '}
            <strong className="text-blue-300">
              {engine?.productionRuntime || engine?.asaasEnv === 'production' ? 'produção' : 'homologação'}
            </strong>
          </span>
          <span>
            Runtime: <strong>{meta?.gitCommit || '—'}</strong>
          </span>
        </div>
      ) : null}

      <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 space-y-1">
        <p>
          <strong>Aprovar e Enviar PIX</strong>: executa uma transferência real ao jogador automaticamente.
        </p>
        <p>
          <strong>Marcar como Pago Manualmente</strong>: NÃO envia PIX. Use apenas quando o pagamento já foi
          realizado fora da plataforma (baixa administrativa).
        </p>
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

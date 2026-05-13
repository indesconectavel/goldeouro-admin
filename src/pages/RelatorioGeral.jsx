import React, { useEffect, useState } from 'react';
import { getData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';

const fmtMoney = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n || 0));

const RelatorioGeral = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dash, setDash] = useState(null);
  const [fin, setFin] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [d, f] = await Promise.all([
          getData('/api/admin/dashboard/stats'),
          getData('/api/admin/financial/report')
        ]);
        if (!d?.success || !d?.data) throw new Error(d?.message || 'Falha no dashboard');
        if (!f?.success || !f?.data) throw new Error(f?.message || 'Falha no relatório financeiro');
        setDash(d.data);
        setFin(f.data);
      } catch (e) {
        console.error(e);
        setDash(null);
        setFin(null);
        setError(e?.message || 'Não foi possível montar o relatório parcial.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return <StandardLoader message="Carregando visão consolidada (parcial)..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório geral (parcial)</h1>
        <div className="p-4 rounded bg-red-500/20 border border-red-500/40 text-red-200">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400">Relatório geral (parcial)</h1>
      <p className="text-gray-400 text-sm">
        Apenas métricas disponíveis via <code className="text-yellow-200/90">/api/admin/dashboard/stats</code> e{' '}
        <code className="text-yellow-200/90">/api/admin/financial/report</code>. Não há consolidação de chutes/gols
        globais nesta tela.
      </p>

      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate title="Total de usuários" value={dash?.total_users ?? 0} color="yellow" />
        <CardTemplate title="Saldo agregado (usuários)" value={fmtMoney(dash?.saldo_total)} color="green" />
        <CardTemplate title="Saques pendentes" value={dash?.saques_pendentes ?? 0} color="red" />
        <CardTemplate title="Volume financeiro (ledger)" value={fmtMoney(dash?.volume_financeiro_total)} color="blue" />
        <CardTemplate title="Depósitos (ledger)" value={fmtMoney(fin?.receitas_depositos)} color="green" />
        <CardTemplate title="Saques (ledger)" value={fmtMoney(fin?.saques_total)} color="red" />
      </GridTemplate>
    </div>
  );
};

export default RelatorioGeral;

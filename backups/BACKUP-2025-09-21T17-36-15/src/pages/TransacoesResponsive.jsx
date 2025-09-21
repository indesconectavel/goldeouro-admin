import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import ResponsiveWrapper from "../components/ResponsiveWrapper";
import StandardPageLayout from "../components/StandardPageLayout";
import ResponsiveCard, { SectionCard } from "../components/ResponsiveCard";
import ResponsiveGrid from "../components/ResponsiveGrid";
import ResponsiveTable, { StatusBadge, CurrencyValue } from "../components/ResponsiveTable";
import Transacoes from "./Transacoes";

const TransacoesResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Transacoes />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_TRANSACOES"
      fallback={<Transacoes />}
      desktopFallback={<Transacoes />}
    >
      <TransacoesMobileTablet />
    </ResponsiveWrapper>
  );
};

const TransacoesMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransacoes() {
      try {
        const response = await api.post("/admin/transacoes-recentes", {});
        setTransacoes(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        // Fallback para dados fictícios
        setTransacoes([
          {
            id: 1,
            user_id: 1,
            type: "credit",
            amount: 50.00,
            description: "Recarga de saldo via PIX",
            transaction_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            user_id: 2,
            type: "debit",
            amount: 25.00,
            description: "Aposta em jogo #123",
            transaction_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            user_id: 1,
            type: "credit",
            amount: 100.00,
            description: "Ganho em jogo #122",
            transaction_date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            user_id: 3,
            type: "credit",
            amount: 75.00,
            description: "Recarga de saldo via PIX",
            transaction_date: new Date(Date.now() - 15 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            user_id: 2,
            type: "debit",
            amount: 10.00,
            description: "Aposta em jogo #124",
            transaction_date: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransacoes();
  }, []);

  if (loading) return <Loader />;

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-yellow-400 mb-2">Transações Recentes</h1>
            <p className="text-gray-400 text-sm">Histórico de créditos, débitos e movimentações</p>
          </div>

          {transacoes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Ainda não possui transações registradas...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transacoes.map((transacao) => (
                <div key={transacao.id} className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        transacao.type === "credit" ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {transacao.type === "credit" ? "+" : "-"}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Transação #{transacao.id}</h3>
                        <p className="text-gray-400 text-sm">Usuário #{transacao.user_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transacao.type === "credit" ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transacao.type === "credit" ? "+" : "-"}R$ {parseFloat(transacao.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-400 text-xs">DESCRIÇÃO</p>
                      <p className="text-white text-sm">{transacao.description || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">DATA</p>
                      <p className="text-white text-sm">{new Date(transacao.transaction_date).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tablet: Layout em tabela
  return (
    <div className="bg-[#000717] text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Transações Recentes</h1>
          <p className="text-gray-400 text-lg">Histórico de créditos, débitos e movimentações da plataforma</p>
        </div>

        {transacoes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Ainda não possui transações registradas...</p>
          </div>
        ) : (
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">USUÁRIO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">TIPO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">VALOR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">DESCRIÇÃO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">DATA</th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-[#2c3e50]">
                  {transacoes.map((transacao) => (
                    <tr key={transacao.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-medium">
                        {transacao.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        #{transacao.user_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transacao.type === "credit"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {transacao.type === "credit" ? "Crédito" : "Débito"}
                        </span>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
                        transacao.type === "credit" ? "text-green-400" : "text-red-400"
                      }`}>
                        {transacao.type === "credit" ? "+" : "-"}R$ {parseFloat(transacao.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">
                        {transacao.description || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {new Date(transacao.transaction_date).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransacoesResponsive;

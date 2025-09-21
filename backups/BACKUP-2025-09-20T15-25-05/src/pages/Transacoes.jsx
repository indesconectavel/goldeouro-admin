import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Transacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransacoes() {
      try {
        const response = await api.post("/admin/transacoes-recentes", {});
        setTransacoes(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransacoes();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="ml-64 p-8 min-h-screen bg-background text-foreground">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Transações Recentes</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Histórico de créditos, débitos e movimentações da plataforma.
      </p>

      {transacoes.length === 0 ? (
        <div className="text-center text-gray-400">Ainda não possui transações registradas...</div>
      ) : (
        <div className="overflow-x-auto bg-card p-4 rounded shadow">
          <table className="min-w-full table-auto border border-border rounded-lg shadow-sm">
            <thead className="bg-[#111827] text-yellow-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 border border-border">ID</th>
                <th className="px-4 py-3 border border-border">Usuário</th>
                <th className="px-4 py-3 border border-border">Tipo</th>
                <th className="px-4 py-3 border border-border">Valor</th>
                <th className="px-4 py-3 border border-border">Descrição</th>
                <th className="px-4 py-3 border border-border">Data</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id} className="text-center hover:bg-muted/30 text-sm">
                  <td className="px-4 py-2 border border-border">{transacao.id}</td>
                  <td className="px-4 py-2 border border-border">{transacao.user_id}</td>
                  <td
                    className={`px-4 py-2 border border-border font-semibold ${
                      transacao.type === "credit"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {transacao.type === "credit" ? "Crédito" : "Débito"}
                  </td>
                  <td className="px-4 py-2 border border-border">
                    R$ {parseFloat(transacao.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border border-border">
                    {transacao.description || "-"}
                  </td>
                  <td className="px-4 py-2 border border-border">
                    {new Date(transacao.transaction_date).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transacoes;

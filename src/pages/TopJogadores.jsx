// src/pages/TopJogadores.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const TopJogadores = () => {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopJogadores() {
      try {
        // ⚠️ Endpoint real pode ser ajustado futuramente
        const response = await api.post('/admin/top-jogadores', {});
        setJogadores(response.data);
      } catch (error) {
        console.error("Erro ao buscar top jogadores:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopJogadores();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-8 rounded shadow-md max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2 text-center">
          Top Jogadores
        </h1>
        <p className="text-muted-foreground mb-6 text-center">
          Ranking dos jogadores com melhor desempenho no Gol de Ouro.
        </p>

        {jogadores.length === 0 ? (
          <p className="text-muted-foreground text-center mt-20">
            Ainda não possui dados suficientes para o ranking.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-border rounded-lg shadow-sm">
              <thead className="bg-[#111827] text-yellow-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 border border-border">#</th>
                  <th className="px-4 py-3 border border-border">Jogador</th>
                  <th className="px-4 py-3 border border-border">Gols</th>
                  <th className="px-4 py-3 border border-border">Partidas</th>
                  <th className="px-4 py-3 border border-border">Eficiência</th>
                </tr>
              </thead>
              <tbody>
                {jogadores.map((jogador, index) => (
                  <tr key={jogador.id || index} className="text-sm text-center hover:bg-muted/30">
                    <td className="px-4 py-2 border border-border font-bold">{index + 1}</td>
                    <td className="px-4 py-2 border border-border">{jogador.name}</td>
                    <td className="px-4 py-2 border border-border">{jogador.totalGols}</td>
                    <td className="px-4 py-2 border border-border">{jogador.totalPartidas}</td>
                    <td className="px-4 py-2 border border-border">
                      {jogador.eficiencia ? `${jogador.eficiencia.toFixed(1)}%` : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopJogadores;

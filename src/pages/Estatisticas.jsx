// src/pages/Estatisticas.jsx

import React, { useEffect, useState } from "react";
import api from '../services/api';

const Estatisticas = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/estatisticas-gerais');
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // DADOS ZERADOS PARA PRODUÇÃO
        setStats({
          totalUsuarios: 0,
          totalJogos: 0,
          totalReceita: "R$ 0,00",
          totalLucro: "R$ 0,00",
          usuariosAtivos: 0,
          jogosHoje: 0,
          receitaHoje: "R$ 0,00",
          topJogadores: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="card p-6 max-w-6xl mx-auto">
          <div className="text-center text-yellow-400">Carregando estatísticas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Estatísticas</h1>
      <p className="text-gray-300 mb-6">
        Painel com dados de desempenho, uso da plataforma e engajamento dos jogadores.
      </p>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center border border-yellow-500/20">
            <h3 className="text-sm font-medium text-yellow-300 mb-2">Total de Usuários</h3>
            <p className="text-2xl font-bold text-white">{stats.totalUsuarios}</p>
          </div>
          <div className="card p-6 text-center border border-yellow-500/20">
            <h3 className="text-sm font-medium text-yellow-300 mb-2">Total de Jogos</h3>
            <p className="text-2xl font-bold text-white">{stats.totalJogos}</p>
          </div>
          <div className="card p-6 text-center border border-green-500/20">
            <h3 className="text-sm font-medium text-green-300 mb-2">Receita Total</h3>
            <p className="text-2xl font-bold text-green-400">{stats.totalReceita}</p>
          </div>
          <div className="card p-6 text-center border border-green-500/20">
            <h3 className="text-sm font-medium text-green-300 mb-2">Lucro Total</h3>
            <p className="text-2xl font-bold text-green-400">{stats.totalLucro}</p>
          </div>
        </div>
      )}

      {stats && stats.topJogadores && (
        <div className="card p-6 border border-yellow-500/20">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Top Jogadores</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-yellow-500/20">
                  <th className="text-left py-2 text-yellow-300">Posição</th>
                  <th className="text-left py-2 text-yellow-300">Nome</th>
                  <th className="text-left py-2 text-yellow-300">Chutes</th>
                  <th className="text-left py-2 text-yellow-300">Gols</th>
                  <th className="text-left py-2 text-yellow-300">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {stats.topJogadores.map((jogador, index) => (
                  <tr key={index} className="border-b border-yellow-500/10">
                    <td className="py-2 text-white font-bold">#{index + 1}</td>
                    <td className="py-2 text-white">{jogador.nome}</td>
                    <td className="py-2 text-yellow-300">{jogador.chutes}</td>
                    <td className="py-2 text-green-400">{jogador.gols}</td>
                    <td className="py-2 text-green-400 font-semibold">{jogador.saldo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estatisticas;

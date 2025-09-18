// src/pages/Estatisticas.jsx

import React from "react";

const Estatisticas = () => {
  // Dados fictícios para demonstração
  const estatisticas = {
    totalUsuarios: 50,
    totalJogos: 100,
    totalApostas: 1000.00,
    totalPremios: 500.00,
    lucro: 250.00,
    taxaSucesso: 75.5,
    mediaChutesPorUsuario: 2.0,
    jogosHoje: 15,
    jogosEstaSemana: 45,
    jogosEsteMes: 100,
    topJogadores: [
      { nome: 'João Silva', jogos: 25, vitorias: 18, taxaVitoria: 72.0 },
      { nome: 'Maria Santos', jogos: 22, vitorias: 16, taxaVitoria: 72.7 },
      { nome: 'Pedro Costa', jogos: 20, vitorias: 14, taxaVitoria: 70.0 },
      { nome: 'Ana Oliveira', jogos: 18, vitorias: 13, taxaVitoria: 72.2 },
      { nome: 'Carlos Lima', jogos: 15, vitorias: 11, taxaVitoria: 73.3 }
    ]
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="bg-card p-6 rounded shadow-md max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">📊 Estatísticas</h1>
        <p className="text-muted-foreground mb-6">
          Painel com dados de desempenho, uso da plataforma e engajamento dos jogadores.
        </p>

        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">👥 Total de Usuários</h3>
            <p className="text-3xl font-bold text-white">{estatisticas.totalUsuarios}</p>
          </div>
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎮 Total de Jogos</h3>
            <p className="text-3xl font-bold text-white">{estatisticas.totalJogos}</p>
          </div>
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">💰 Total de Apostas</h3>
            <p className="text-3xl font-bold text-white">R$ {estatisticas.totalApostas.toFixed(2)}</p>
          </div>
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🏆 Total de Prêmios</h3>
            <p className="text-3xl font-bold text-white">R$ {estatisticas.totalPremios.toFixed(2)}</p>
          </div>
        </div>

        {/* Cards Secundários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">📈 Lucro</h3>
            <p className="text-3xl font-bold text-green-400">R$ {estatisticas.lucro.toFixed(2)}</p>
          </div>
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎯 Taxa de Sucesso</h3>
            <p className="text-3xl font-bold text-white">{estatisticas.taxaSucesso}%</p>
          </div>
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🏃🏽‍♂️ Média de Chutes/Usuário</h3>
            <p className="text-3xl font-bold text-white">{estatisticas.mediaChutesPorUsuario}</p>
          </div>
          <div className="bg-[#1f2937] p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">📅 Jogos Hoje</h3>
            <p className="text-3xl font-bold text-white">{estatisticas.jogosHoje}</p>
          </div>
        </div>

        {/* Tabela de Top Jogadores */}
        <div className="bg-[#1f2937] rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-600">
            <h3 className="text-lg font-semibold text-yellow-400">🏆 Top Jogadores</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Posição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Jogos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vitórias</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Taxa de Vitória</th>
                </tr>
              </thead>
              <tbody className="bg-[#1f2937] divide-y divide-gray-600">
                {estatisticas.topJogadores.map((jogador, index) => (
                  <tr key={index} className="hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {jogador.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {jogador.jogos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {jogador.vitorias}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {jogador.taxaVitoria}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;
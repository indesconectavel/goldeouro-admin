// src/pages/TopJogadoresResponsive.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import ResponsiveWrapper from "../components/ResponsiveWrapper";
import StandardPageLayout from "../components/StandardPageLayout";
import ResponsiveCard, { SectionCard } from "../components/ResponsiveCard";
import ResponsiveGrid from "../components/ResponsiveGrid";
import ResponsiveTable, { StatusBadge, CurrencyValue } from "../components/ResponsiveTable";
import TopJogadores from "./TopJogadores";

const TopJogadoresResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <TopJogadores />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_TOP_JOGADORES"
      fallback={<TopJogadores />}
      desktopFallback={<TopJogadores />}
    >
      <TopJogadoresMobileTablet />
    </ResponsiveWrapper>
  );
};

const TopJogadoresMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados fictícios para fallback
  const dadosFicticios = [
    { id: 1, name: 'João Silva', games: 25, wins: 18, goals: 15, efficiency: 72.0 },
    { id: 2, name: 'Maria Santos', games: 22, wins: 16, goals: 12, efficiency: 72.7 },
    { id: 3, name: 'Pedro Costa', games: 20, wins: 14, goals: 10, efficiency: 70.0 },
    { id: 4, name: 'Ana Oliveira', games: 18, wins: 12, goals: 8, efficiency: 66.7 },
    { id: 5, name: 'Carlos Lima', games: 15, wins: 10, goals: 7, efficiency: 66.7 }
  ];

  useEffect(() => {
    async function fetchTopJogadores() {
      try {
        // Tentar buscar dados reais
        const response = await api.get('/admin/top-jogadores');
        setJogadores(response.data);
      } catch (error) {
        console.error("Erro ao buscar top jogadores, usando dados fictícios:", error);
        // Usar dados fictícios em caso de erro
        setJogadores(dadosFicticios);
      } finally {
        setLoading(false);
      }
    }

    fetchTopJogadores();
  }, []);

  if (loading) return <Loader />;

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-yellow-400 mb-2">Top Jogadores</h1>
            <p className="text-gray-400 text-sm">Ranking dos jogadores com melhor desempenho</p>
          </div>

          <div className="space-y-4">
            {jogadores.map((jogador, index) => (
              <div key={jogador.id || index} className={`bg-[#111827] rounded-lg border border-[#2c3e50] p-4 ${index === 0 ? 'ring-2 ring-yellow-400' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-black' : 
                      index === 1 ? 'bg-gray-300 text-black' : 
                      index === 2 ? 'bg-orange-400 text-black' : 
                      'bg-gray-600 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <h3 className="text-white font-medium text-lg">{jogador.name}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">JOGOS</p>
                    <p className="text-white font-semibold">{jogador.games}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">VITÓRIAS</p>
                    <p className="text-green-400 font-semibold">{jogador.wins}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">GOLS</p>
                    <p className="text-yellow-400 font-semibold">{jogador.goals}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">TAXA DE VITÓRIA</p>
                    <p className="text-blue-400 font-semibold">{jogador.efficiency}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {jogadores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Ainda não há dados suficientes para o ranking</p>
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
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Top Jogadores</h1>
          <p className="text-gray-400 text-lg">Ranking dos jogadores com melhor desempenho no Gol de Ouro</p>
        </div>

        <div className="bg-[#111827] rounded-lg border border-[#2c3e50] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">POSIÇÃO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">NOME</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">JOGOS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">VITÓRIAS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">GOLS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">TAXA DE VITÓRIA</th>
                </tr>
              </thead>
              <tbody className="bg-[#111827] divide-y divide-[#2c3e50]">
                {jogadores.map((jogador, index) => (
                  <tr key={jogador.id || index} className={`hover:bg-[#1a1a1a] transition-colors ${index === 0 ? 'bg-yellow-400/10' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-white">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-medium">
                      {jogador.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {jogador.games}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 font-semibold">
                      {jogador.wins}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-400 font-semibold">
                      {jogador.goals}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400 font-semibold">
                      {jogador.efficiency}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {jogadores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Ainda não há dados suficientes para o ranking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopJogadoresResponsive;

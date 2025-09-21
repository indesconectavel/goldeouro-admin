// src/pages/EstatisticasResponsive.jsx

import React from "react";
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { StatCard, SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid, { StatsGrid, MetricsGrid } from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue, NumberValue } from '../components/ResponsiveTable';
import Estatisticas from './Estatisticas';

const EstatisticasResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Estatisticas />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_ESTATISTICAS"
      fallback={<Estatisticas />}
      desktopFallback={<Estatisticas />}
    >
      <EstatisticasMobileTablet />
    </ResponsiveWrapper>
  );
};

const EstatisticasMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  
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

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <PageTitle>📊 Estatísticas</PageTitle>
            <p className="text-gray-400 text-sm">Painel com dados de desempenho e engajamento</p>
          </div>

          {/* Cards Principais */}
          <div className="space-y-4 mb-6">
            <div className="bg-[#111827] p-4 rounded-lg border border-[#2c3e50]">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">👥 Total de Usuários</h3>
                <p className="text-2xl font-bold text-white">{estatisticas.totalUsuarios}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-lg border border-[#2c3e50]">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">🎮 Total de Jogos</h3>
                <p className="text-2xl font-bold text-white">{estatisticas.totalJogos}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-lg border border-[#2c3e50]">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">💰 Total de Apostas</h3>
                <p className="text-2xl font-bold text-white">R$ {estatisticas.totalApostas.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-lg border border-[#2c3e50]">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">🏆 Total de Prêmios</h3>
                <p className="text-2xl font-bold text-white">R$ {estatisticas.totalPremios.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-lg border border-[#2c3e50]">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">💵 Lucro</h3>
                <p className="text-2xl font-bold text-green-400">R$ {estatisticas.lucro.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-lg border border-[#2c3e50]">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">📈 Taxa de Sucesso</h3>
                <p className="text-2xl font-bold text-blue-400">{estatisticas.taxaSucesso}%</p>
              </div>
            </div>
          </div>

          {/* Métricas Adicionais */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4 mb-6">
            <h2 className="text-lg font-bold text-yellow-400 mb-4">📊 Métricas Detalhadas</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400 text-sm">Média de Chutes por Usuário:</span>
                <span className="text-white font-semibold text-sm">{estatisticas.mediaChutesPorUsuario}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400 text-sm">Jogos Hoje:</span>
                <span className="text-white font-semibold text-sm">{estatisticas.jogosHoje}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400 text-sm">Jogos Esta Semana:</span>
                <span className="text-white font-semibold text-sm">{estatisticas.jogosEstaSemana}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-sm">Jogos Este Mês:</span>
                <span className="text-white font-semibold text-sm">{estatisticas.jogosEsteMes}</span>
              </div>
            </div>
          </div>

          {/* Top Jogadores */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
            <h2 className="text-lg font-bold text-yellow-400 mb-4">🏆 Top Jogadores</h2>
            
            <div className="space-y-3">
              {estatisticas.topJogadores.map((jogador, index) => (
                <div key={index} className="bg-[#1a1a1a] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="text-black font-bold text-xs">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm">{jogador.nome}</h3>
                        <p className="text-gray-400 text-xs">{jogador.jogos} jogos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold text-sm">{jogador.taxaVitoria}%</p>
                      <p className="text-gray-400 text-xs">{jogador.vitorias} vitórias</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tablet: Layout em grid
  return (
    <div className="bg-[#000717] text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <PageTitle>📊 Estatísticas</PageTitle>
          <p className="text-gray-400 text-lg">Painel com dados de desempenho, uso da plataforma e engajamento dos jogadores</p>
        </div>

        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">👥 Total de Usuários</h3>
            <p className="text-3xl font-bold text-white">{estatisticas.totalUsuarios}</p>
          </div>
          
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎮 Total de Jogos</h3>
            <p className="text-3xl font-bold text-white">{estatisticas.totalJogos}</p>
          </div>
          
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">💰 Total de Apostas</h3>
            <p className="text-3xl font-bold text-white">R$ {estatisticas.totalApostas.toFixed(2)}</p>
          </div>
          
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🏆 Total de Prêmios</h3>
            <p className="text-3xl font-bold text-white">R$ {estatisticas.totalPremios.toFixed(2)}</p>
          </div>
          
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">💵 Lucro</h3>
            <p className="text-3xl font-bold text-green-400">R$ {estatisticas.lucro.toFixed(2)}</p>
          </div>
          
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">📈 Taxa de Sucesso</h3>
            <p className="text-3xl font-bold text-blue-400">{estatisticas.taxaSucesso}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Métricas Adicionais */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">📊 Métricas Detalhadas</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Média de Chutes por Usuário:</span>
                <span className="text-white font-semibold">{estatisticas.mediaChutesPorUsuario}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Jogos Hoje:</span>
                <span className="text-white font-semibold">{estatisticas.jogosHoje}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Jogos Esta Semana:</span>
                <span className="text-white font-semibold">{estatisticas.jogosEstaSemana}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Jogos Este Mês:</span>
                <span className="text-white font-semibold">{estatisticas.jogosEsteMes}</span>
              </div>
            </div>
          </div>

          {/* Top Jogadores */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">🏆 Top Jogadores</h2>
            
            <div className="space-y-4">
              {estatisticas.topJogadores.map((jogador, index) => (
                <div key={index} className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="text-black font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{jogador.nome}</h3>
                        <p className="text-gray-400 text-sm">{jogador.jogos} jogos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{jogador.taxaVitoria}%</p>
                      <p className="text-gray-400 text-sm">{jogador.vitorias} vitórias</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasResponsive;

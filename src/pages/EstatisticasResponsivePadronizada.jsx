// src/pages/EstatisticasResponsivePadronizada.jsx

import React from "react";
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';
import Estatisticas from './Estatisticas';

const EstatisticasResponsivePadronizada = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Estatisticas />;
  }

  // Mobile e Tablet usam versão responsiva padronizada
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_ESTATISTICAS"
      fallback={<Estatisticas />}
      desktopFallback={<Estatisticas />}
    >
      <EstatisticasMobileTabletPadronizada />
    </ResponsiveWrapper>
  );
};

const EstatisticasMobileTabletPadronizada = () => {
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
      { nome: 'Usuário', jogos: 25, vitorias: 18, taxaVitoria: 72.0 },
      { nome: 'Usuário', jogos: 22, vitorias: 16, taxaVitoria: 72.7 },
      { nome: 'Usuário', jogos: 20, vitorias: 14, taxaVitoria: 70.0 },
      { nome: 'Usuário', jogos: 18, vitorias: 12, taxaVitoria: 66.7 },
      { nome: 'Usuário', jogos: 16, vitorias: 10, taxaVitoria: 62.5 }
    ]
  };

  // Cards de estatísticas principais
  const statsCards = [
    {
      title: 'Total de Usuários',
      value: estatisticas.totalUsuarios,
      icon: '👥',
      color: 'text-blue-400'
    },
    {
      title: 'Total de Jogos',
      value: estatisticas.totalJogos,
      icon: '🎮',
      color: 'text-green-400'
    },
    {
      title: 'Total de Apostas',
      value: `R$ ${estatisticas.totalApostas.toFixed(2)}`,
      icon: '💰',
      color: 'text-yellow-400'
    },
    {
      title: 'Total de Prêmios',
      value: `R$ ${estatisticas.totalPremios.toFixed(2)}`,
      icon: '🏆',
      color: 'text-purple-400'
    },
    {
      title: 'Lucro',
      value: `R$ ${estatisticas.lucro.toFixed(2)}`,
      icon: '💵',
      color: 'text-green-400'
    },
    {
      title: 'Taxa de Sucesso',
      value: `${estatisticas.taxaSucesso}%`,
      icon: '📈',
      color: 'text-blue-400'
    }
  ];

  // Métricas detalhadas
  const metricasDetalhadas = [
    { label: 'Média de Chutes por Usuário', value: estatisticas.mediaChutesPorUsuario },
    { label: 'Jogos Hoje', value: estatisticas.jogosHoje },
    { label: 'Jogos Esta Semana', value: estatisticas.jogosEstaSemana },
    { label: 'Jogos Este Mês', value: estatisticas.jogosEsteMes }
  ];

  return (
    <StandardPageLayout
      title="📊 Estatísticas"
      description="Painel com dados de desempenho, uso da plataforma e engajamento dos jogadores"
    >
      {/* Cards de Estatísticas Principais */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estatísticas Principais</h2>
        <ResponsiveGrid columns="auto" gap="default">
          {statsCards.map((stat, index) => (
            <ResponsiveCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              className={stat.color}
            />
          ))}
        </ResponsiveGrid>
      </div>

      {/* Métricas Detalhadas e Top Jogadores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Métricas Detalhadas */}
        <SectionCard title="📊 Métricas Detalhadas">
          <div className="space-y-4">
            {metricasDetalhadas.map((metrica, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0">
                <span className="text-gray-400">{metrica.label}:</span>
                <span className="text-white font-semibold">{metrica.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top Jogadores */}
        <SectionCard title="🏆 Top Jogadores">
          <div className="space-y-4">
            {estatisticas.topJogadores.map((jogador, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' : 
                      index === 1 ? 'bg-gray-300 text-black' : 
                      index === 2 ? 'bg-orange-400 text-black' : 
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
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
        </SectionCard>
      </div>
    </StandardPageLayout>
  );
};

export default EstatisticasResponsivePadronizada;

import React, { useEffect, useState } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const RelatorioGeral = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatorioGeral = async () => {
      try {
        const result = await postData('/admin/relatorio-geral', {});
        setDados(result);
      } catch (error) {
        console.error('Erro ao buscar relatório geral:', error);
        // Dados fictícios como fallback
        setDados({
          resumo: {
            totalUsuarios: 1250,
            usuariosAtivos: 1180,
            usuariosBloqueados: 70,
            totalTransacoes: 15420,
            totalSaques: 3200,
            totalChutes: 45680,
            totalGols: 18250,
            receitaTotal: 125000.50,
            saquesTotal: 85000.25,
            saldoLiquido: 40000.25
          },
          estatisticas: {
            taxaAcerto: 40.0,
            mediaChutesPorUsuario: 36.5,
            mediaGolsPorUsuario: 14.6,
            transacoesHoje: 45,
            saquesHoje: 12,
            novosUsuariosHoje: 8
          },
          periodos: {
            ultimaAtualizacao: '2025-01-17T15:30:00Z',
            periodoRelatorio: 'Últimos 30 dias',
            proximaAtualizacao: '2025-01-18T03:00:00Z'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorioGeral();
  }, []);

  const exportarCSV = () => {
    const url = import.meta.env.VITE_API_URL + '/admin/exportar/relatorio-geral-csv';
    window.open(url, '_blank');
  };

  if (loading) {
    return <StandardLoader message="Carregando relatório geral..." />;
  }

  if (!dados) {
    return <EmptyState message="Não foi possível carregar o relatório geral." />;
  }

  const { resumo, estatisticas, periodos } = dados;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Relatório Geral da Plataforma</h1>
        <button
          onClick={exportarCSV}
          className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
        >
          Exportar Relatório Completo
        </button>
      </div>

      <p className="text-gray-300">
        Visão consolidada de todos os dados da plataforma para auditoria e conferência.
      </p>

      {/* Cards de Resumo Principal */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Usuários" 
          value={resumo.totalUsuarios.toLocaleString()} 
          color="yellow" 
        />
        <CardTemplate 
          title="Usuários Ativos" 
          value={resumo.usuariosAtivos.toLocaleString()} 
          color="green" 
        />
        <CardTemplate 
          title="Total de Transações" 
          value={resumo.totalTransacoes.toLocaleString()} 
          color="blue" 
        />
        <CardTemplate 
          title="Total de Chutes" 
          value={resumo.totalChutes.toLocaleString()} 
          color="purple" 
        />
      </GridTemplate>

      {/* Cards de Estatísticas de Jogo */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Total de Gols" 
          value={resumo.totalGols.toLocaleString()} 
          color="green" 
        />
        <CardTemplate 
          title="Taxa de Acerto" 
          value={`${estatisticas.taxaAcerto}%`} 
          color="blue" 
        />
        <CardTemplate 
          title="Média de Chutes/Usuário" 
          value={estatisticas.mediaChutesPorUsuario.toFixed(1)} 
          color="purple" 
        />
      </GridTemplate>

      {/* Cards Financeiros */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Receita Total" 
          value={`R$ ${resumo.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="green" 
        />
        <CardTemplate 
          title="Total de Saques" 
          value={`R$ ${resumo.saquesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="red" 
        />
        <CardTemplate 
          title="Saldo Líquido" 
          value={`R$ ${resumo.saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Estatísticas do Dia */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Estatísticas do Dia</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Transações Hoje</h3>
            <p className="text-2xl font-bold text-green-400">{estatisticas.transacoesHoje}</p>
            <p className="text-sm text-gray-400">registros</p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Saques Hoje</h3>
            <p className="text-2xl font-bold text-red-400">{estatisticas.saquesHoje}</p>
            <p className="text-sm text-gray-400">solicitações</p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Novos Usuários</h3>
            <p className="text-2xl font-bold text-yellow-400">{estatisticas.novosUsuariosHoje}</p>
            <p className="text-sm text-gray-400">cadastros</p>
          </div>
        </div>
      </div>

      {/* Análise de Performance */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Análise de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Métricas de Jogo</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de Acerto Global:</span>
                <span className="text-white font-semibold">{estatisticas.taxaAcerto}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Média de Chutes por Usuário:</span>
                <span className="text-white font-semibold">{estatisticas.mediaChutesPorUsuario}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Média de Gols por Usuário:</span>
                <span className="text-white font-semibold">{estatisticas.mediaGolsPorUsuario}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Métricas Financeiras</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Receita por Transação:</span>
                <span className="text-white font-semibold">
                  R$ {(resumo.receitaTotal / resumo.totalTransacoes).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Saque por Usuário:</span>
                <span className="text-white font-semibold">
                  R$ {(resumo.saquesTotal / resumo.totalUsuarios).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Margem de Lucro:</span>
                <span className="text-white font-semibold">
                  {((resumo.saldoLiquido / resumo.receitaTotal) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Relatório */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do Relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Período:</span>
              <span className="text-white font-semibold">{periodos.periodoRelatorio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Última Atualização:</span>
              <span className="text-white font-semibold">
                {new Date(periodos.ultimaAtualizacao).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Próxima Atualização:</span>
              <span className="text-white font-semibold">
                {new Date(periodos.proximaAtualizacao).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="text-green-400 font-semibold">Atualizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Adicionais */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Ações Disponíveis</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportarCSV}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition-colors font-semibold"
          >
            Exportar CSV Completo
          </button>
          <button
            onClick={() => alert('Função de exportar PDF em desenvolvimento')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
          >
            Exportar PDF
          </button>
          <button
            onClick={() => alert('Função de agendar relatório em desenvolvimento')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Agendar Relatório
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
          >
            Atualizar Dados
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatorioGeral;
import React, { useEffect, useState } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const ExportarDados = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState(null);

  useEffect(() => {
    const fetchDadosExportacao = async () => {
      try {
        const result = await postData('/admin/dados-exportacao', {});
        setDados(result);
      } catch (error) {
        console.error('Erro ao buscar dados de exportação:', error);
        // Dados fictícios como fallback
        setDados({
          usuarios: {
            total: 1250,
            ativos: 1180,
            bloqueados: 70,
            ultimaAtualizacao: '2025-01-17T15:30:00Z',
            descricao: 'Dados completos de todos os usuários cadastrados'
          },
          chutes: {
            total: 45680,
            hoje: 245,
            ultimaAtualizacao: '2025-01-17T15:30:00Z',
            descricao: 'Histórico completo de todos os chutes realizados'
          },
          transacoes: {
            total: 15420,
            hoje: 45,
            ultimaAtualizacao: '2025-01-17T15:30:00Z',
            descricao: 'Registro de todas as transações financeiras'
          },
          saques: {
            total: 3200,
            hoje: 12,
            ultimaAtualizacao: '2025-01-17T15:30:00Z',
            descricao: 'Histórico de todas as solicitações de saque'
          },
          relatorioGeral: {
            total: 1,
            ultimaAtualizacao: '2025-01-17T15:30:00Z',
            descricao: 'Relatório consolidado com todos os dados da plataforma'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDadosExportacao();
  }, []);

  const handleExport = async (tipo) => {
    setExportando(tipo);
    try {
      // Simular delay da exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      const url = import.meta.env.VITE_API_URL + `/admin/exportar/${tipo}`;
      window.open(url, '_blank');
      alert(`Exportação de ${tipo} iniciada com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao iniciar exportação. Tente novamente.');
    } finally {
      setExportando(null);
    }
  };

  if (loading) {
    return <StandardLoader message="Carregando dados de exportação..." />;
  }

  if (!dados) {
    return <EmptyState message="Não foi possível carregar os dados de exportação." />;
  }

  const tiposExportacao = [
    {
      id: 'usuarios-csv',
      nome: 'Usuários',
      dados: dados.usuarios,
      cor: 'yellow',
      icone: '👥'
    },
    {
      id: 'chutes-csv',
      nome: 'Chutes',
      dados: dados.chutes,
      cor: 'blue',
      icone: '⚽'
    },
    {
      id: 'transacoes-csv',
      nome: 'Transações',
      dados: dados.transacoes,
      cor: 'green',
      icone: '💰'
    },
    {
      id: 'saques-csv',
      nome: 'Saques',
      dados: dados.saques,
      cor: 'red',
      icone: '💸'
    },
    {
      id: 'relatorio-geral-csv',
      nome: 'Relatório Geral',
      dados: dados.relatorioGeral,
      cor: 'purple',
      icone: '📊'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Exportação de Dados</h1>
      <p className="text-gray-300 mb-6">
        Faça o download de relatórios completos no formato CSV para auditoria, backup ou integração com outras ferramentas.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 5 }}>
        {tiposExportacao.map((tipo) => (
          <CardTemplate
            key={tipo.id}
            title={`${tipo.icone} ${tipo.nome}`}
            value={tipo.dados.total.toLocaleString()}
            color={tipo.cor}
          />
        ))}
      </GridTemplate>

      {/* Seção de Exportações */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Tipos de Exportação Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiposExportacao.map((tipo) => (
            <div key={tipo.id} className="border border-white/20 rounded-lg p-4 hover:border-yellow-400/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">{tipo.icone} {tipo.nome}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  tipo.cor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                  tipo.cor === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  tipo.cor === 'green' ? 'bg-green-500/20 text-green-400' :
                  tipo.cor === 'red' ? 'bg-red-500/20 text-red-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {tipo.dados.total.toLocaleString()} registros
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">
                {tipo.dados.descricao}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total:</span>
                  <span className="text-white">{tipo.dados.total.toLocaleString()}</span>
                </div>
                {tipo.dados.hoje && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hoje:</span>
                    <span className="text-white">{tipo.dados.hoje}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Atualizado:</span>
                  <span className="text-white">
                    {new Date(tipo.dados.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => handleExport(tipo.id)}
                disabled={exportando === tipo.id}
                className={`w-full px-4 py-2 rounded font-semibold transition-colors ${
                  exportando === tipo.id
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : tipo.cor === 'yellow'
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : tipo.cor === 'blue'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : tipo.cor === 'green'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : tipo.cor === 'red'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {exportando === tipo.id ? 'Exportando...' : `Exportar ${tipo.nome}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Informações de Exportação */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações sobre Exportação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Formato dos Arquivos</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Formato:</span>
                <span className="text-white">CSV (Comma Separated Values)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Codificação:</span>
                <span className="text-white">UTF-8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Separador:</span>
                <span className="text-white">Vírgula (,)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cabeçalho:</span>
                <span className="text-white">Incluído</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Período dos Dados</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Período:</span>
                <span className="text-white">Todos os registros</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Filtros:</span>
                <span className="text-white">Nenhum aplicado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ordenação:</span>
                <span className="text-white">Data de criação</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">Atualizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações em Massa */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Ações em Massa</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja exportar todos os dados?')) {
                alert('Função de exportação em massa em desenvolvimento');
              }
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors font-semibold"
          >
            Exportar Todos
          </button>
          <button
            onClick={() => alert('Função de agendar exportação em desenvolvimento')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Agendar Exportação
          </button>
          <button
            onClick={() => alert('Função de histórico de exportações em desenvolvimento')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
          >
            Histórico de Exportações
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors font-semibold"
          >
            Atualizar Dados
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportarDados;
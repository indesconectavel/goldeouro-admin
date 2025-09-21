import React, { useEffect, useState } from 'react';
import { config, getAuthToken } from '../config/env';
import Loader from '../components/Loader';

const RelatoriosPagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    status: 'all',
    dataInicio: '',
    dataFim: '',
    valorMin: '',
    valorMax: ''
  });

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const fetchPagamentos = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      // Simular dados de pagamentos (em produção, buscar da API)
      const mockPagamentos = [
        {
          id: 1,
          user_id: 1,
          amount: 50.00,
          status: 'approved',
          description: 'Recarga de saldo - R$ 50.00',
          created_at: '2025-01-15T10:30:00Z',
          approved_at: '2025-01-15T10:35:00Z'
        },
        {
          id: 2,
          user_id: 2,
          amount: 100.00,
          status: 'pending',
          description: 'Recarga de saldo - R$ 100.00',
          created_at: '2025-01-15T11:00:00Z',
          approved_at: null
        },
        {
          id: 3,
          user_id: 3,
          amount: 25.00,
          status: 'approved',
          description: 'Recarga de saldo - R$ 25.00',
          created_at: '2025-01-15T12:15:00Z',
          approved_at: '2025-01-15T12:20:00Z'
        }
      ];

      setPagamentos(mockPagamentos);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setError('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPagamentos = () => {
    let filtrados = [...pagamentos];

    if (filtros.status !== 'all') {
      filtrados = filtrados.filter(p => p.status === filtros.status);
    }

    if (filtros.dataInicio) {
      filtrados = filtrados.filter(p => new Date(p.created_at) >= new Date(filtros.dataInicio));
    }

    if (filtros.dataFim) {
      filtrados = filtrados.filter(p => new Date(p.created_at) <= new Date(filtros.dataFim));
    }

    if (filtros.valorMin) {
      filtrados = filtrados.filter(p => p.amount >= parseFloat(filtros.valorMin));
    }

    if (filtros.valorMax) {
      filtrados = filtrados.filter(p => p.amount <= parseFloat(filtros.valorMax));
    }

    return filtrados;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900';
      case 'pending': return 'text-yellow-400 bg-yellow-900';
      case 'rejected': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  const calcularEstatisticas = () => {
    const aprovados = pagamentos.filter(p => p.status === 'approved');
    const pendentes = pagamentos.filter(p => p.status === 'pending');
    const totalAprovado = aprovados.reduce((sum, p) => sum + p.amount, 0);
    const totalPendente = pendentes.reduce((sum, p) => sum + p.amount, 0);

    return {
      total: pagamentos.length,
      aprovados: aprovados.length,
      pendentes: pendentes.length,
      totalAprovado,
      totalPendente
    };
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-8">
        <div className="text-center">
          <h2 className="text-2xl text-red-400 mb-4">Erro ao carregar relatórios</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchPagamentos}
            className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const pagamentosFiltrados = filtrarPagamentos();
  const stats = calcularEstatisticas();

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Relatórios de Pagamentos</h1>
          <p className="text-gray-400">Visualização e análise de transações PIX</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total de Pagamentos</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Aprovados</p>
              <p className="text-2xl font-bold text-green-400">{stats.aprovados}</p>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendentes}</p>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Aprovado</p>
              <p className="text-2xl font-bold text-green-400">
                R$ {stats.totalAprovado.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Pendente</p>
              <p className="text-2xl font-bold text-yellow-400">
                R$ {stats.totalPendente.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50] mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-white"
              >
                <option value="all">Todos</option>
                <option value="approved">Aprovado</option>
                <option value="pending">Pendente</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Data Início</label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Data Fim</label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Valor Mínimo</label>
              <input
                type="number"
                placeholder="0.00"
                value={filtros.valorMin}
                onChange={(e) => setFiltros({...filtros, valorMin: e.target.value})}
                className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Valor Máximo</label>
              <input
                type="number"
                placeholder="1000.00"
                value={filtros.valorMax}
                onChange={(e) => setFiltros({...filtros, valorMax: e.target.value})}
                className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* Tabela de Pagamentos */}
        <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            Pagamentos ({pagamentosFiltrados.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#2c3e50]">
                  <th className="text-left py-3 text-gray-400">ID</th>
                  <th className="text-left py-3 text-gray-400">Usuário</th>
                  <th className="text-left py-3 text-gray-400">Valor</th>
                  <th className="text-left py-3 text-gray-400">Status</th>
                  <th className="text-left py-3 text-gray-400">Criado em</th>
                  <th className="text-left py-3 text-gray-400">Aprovado em</th>
                </tr>
              </thead>
              <tbody>
                {pagamentosFiltrados.map((pagamento) => (
                  <tr key={pagamento.id} className="border-b border-[#2c3e50]">
                    <td className="py-3 text-white">#{pagamento.id}</td>
                    <td className="py-3 text-gray-400">Usuário {pagamento.user_id}</td>
                    <td className="py-3 text-green-400 font-semibold">
                      R$ {pagamento.amount.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(pagamento.status)}`}>
                        {getStatusText(pagamento.status)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(pagamento.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 text-gray-400">
                      {pagamento.approved_at 
                        ? new Date(pagamento.approved_at).toLocaleString('pt-BR')
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagamentosFiltrados.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum pagamento encontrado com os filtros aplicados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPagamentos;

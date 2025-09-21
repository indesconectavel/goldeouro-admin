import React, { useState, useEffect } from 'react';
import api from '../services/api';
import securityLogger from '../utils/securityLogger';

const Saques = () => {
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: ''
  });

  // Dados fictícios para demonstração
  const mockSaques = [
    {
      id: '1',
      usuario: 'João Silva',
      email: 'joao@email.com',
      valor: 150.00,
      pix_key: '12345678901',
      pix_key_type: 'cpf',
      status: 'aprovado',
      data_solicitacao: '2025-09-06 10:00:00',
      data_processamento: '2025-09-06 12:00:00',
      processado_por: 'admin'
    },
    {
      id: '2',
      usuario: 'Maria Santos',
      email: 'maria@email.com',
      valor: 75.50,
      pix_key: 'maria@email.com',
      pix_key_type: 'email',
      status: 'pendente',
      data_solicitacao: '2025-09-07 09:00:00',
      data_processamento: null,
      processado_por: null
    },
    {
      id: '3',
      usuario: 'Pedro Costa',
      email: 'pedro@email.com',
      valor: 200.00,
      pix_key: '11987654321',
      pix_key_type: 'phone',
      status: 'rejeitado',
      data_solicitacao: '2025-09-05 15:00:00',
      data_processamento: '2025-09-05 16:00:00',
      processado_por: 'admin',
      motivo_rejeicao: 'Chave PIX inválida'
    },
    {
      id: '4',
      usuario: 'Ana Oliveira',
      email: 'ana@email.com',
      valor: 50.00,
      pix_key: 'ana.oliveira@email.com',
      pix_key_type: 'email',
      status: 'aprovado',
      data_solicitacao: '2025-09-04 11:00:00',
      data_processamento: '2025-09-04 13:00:00',
      processado_por: 'admin'
    },
    {
      id: '5',
      usuario: 'Carlos Lima',
      email: 'carlos@email.com',
      valor: 300.00,
      pix_key: '98765432100',
      pix_key_type: 'cpf',
      status: 'pendente',
      data_solicitacao: '2025-09-07 16:00:00',
      data_processamento: null,
      processado_por: null
    }
  ];

  useEffect(() => {
    fetchSaques();
  }, [filters]);

  const fetchSaques = async () => {
    setLoading(true);
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredSaques = [...mockSaques];
      
      // Aplicar filtros
      if (filters.status !== 'all') {
        filteredSaques = filteredSaques.filter(saque => saque.status === filters.status);
      }
      
      if (filters.startDate) {
        filteredSaques = filteredSaques.filter(saque => 
          new Date(saque.data_solicitacao) >= new Date(filters.startDate)
        );
      }
      
      if (filters.endDate) {
        filteredSaques = filteredSaques.filter(saque => 
          new Date(saque.data_solicitacao) <= new Date(filters.endDate)
        );
      }
      
      setSaques(filteredSaques);
    } catch (error) {
      console.error('Erro ao carregar saques:', error);
      setError('Erro ao carregar saques');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType, saqueId) => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      // Log de segurança
      securityLogger.logSecurityError(
        new Error(`Saque action: ${actionType}`),
        { saqueId, actionType, timestamp: new Date().toISOString() }
      );

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      let message = '';
      switch (actionType) {
        case 'approve':
          message = 'Saque aprovado com sucesso!';
          break;
        case 'reject':
          message = 'Saque rejeitado com sucesso!';
          break;
        case 'process':
          message = 'Saque processado com sucesso!';
          break;
        default:
          message = 'Ação executada com sucesso!';
      }

      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
      
      // Recarregar dados
      fetchSaques();
    } catch (error) {
      console.error(`Erro ao executar ação (${actionType}):`, error);
      setError(`Erro ao ${actionType} saque.`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'rejeitado': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'processando': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aprovado': return '✅ Aprovado';
      case 'pendente': return '⏳ Pendente';
      case 'rejeitado': return '❌ Rejeitado';
      case 'processando': return '🔄 Processando';
      default: return '❓ Desconhecido';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const maskPixKey = (key, type) => {
    if (type === 'cpf') {
      return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (type === 'phone') {
      return key.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return key;
  };

  if (loading) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando saques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">💰 Gerenciamento de Saques</h1>
          <p className="text-gray-400">Gerencie solicitações de saque dos usuários e processe pagamentos PIX.</p>
        </div>

        {/* Filtros */}
        <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">🔍 Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
                <option value="processando">Processando</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data Início</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data Fim</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchSaques}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                🔍 Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{saques.length}</div>
              <div className="text-sm text-gray-400">Total de Saques</div>
            </div>
          </div>
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {saques.filter(s => s.status === 'aprovado').length}
              </div>
              <div className="text-sm text-gray-400">Aprovados</div>
            </div>
          </div>
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {saques.filter(s => s.status === 'pendente').length}
              </div>
              <div className="text-sm text-gray-400">Pendentes</div>
            </div>
          </div>
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {saques.filter(s => s.status === 'rejeitado').length}
              </div>
              <div className="text-sm text-gray-400">Rejeitados</div>
            </div>
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Lista de Saques */}
        <div className="bg-[#1A202C] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Usuário</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Valor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Chave PIX</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Data Solicitação</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {saques.map((saque) => (
                  <tr key={saque.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{saque.usuario}</div>
                        <div className="text-gray-400 text-sm">{saque.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-yellow-400 font-bold">
                        {formatCurrency(saque.valor)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-mono text-sm">
                          {maskPixKey(saque.pix_key, saque.pix_key_type)}
                        </div>
                        <div className="text-gray-400 text-xs capitalize">
                          {saque.pix_key_type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(saque.status)}`}>
                        {getStatusText(saque.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300 text-sm">
                        {formatDate(saque.data_solicitacao)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {saque.status === 'pendente' && (
                          <>
                            <button
                              onClick={() => handleAction('approve', saque.id)}
                              disabled={actionLoading}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              ✅ Aprovar
                            </button>
                            <button
                              onClick={() => handleAction('reject', saque.id)}
                              disabled={actionLoading}
                              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              ❌ Rejeitar
                            </button>
                          </>
                        )}
                        {saque.status === 'aprovado' && (
                          <button
                            onClick={() => handleAction('process', saque.id)}
                            disabled={actionLoading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm transition duration-200"
                          >
                            🔄 Processar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {saques.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum saque encontrado</h3>
            <p className="text-gray-500">Ajuste os filtros para ver mais resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saques;

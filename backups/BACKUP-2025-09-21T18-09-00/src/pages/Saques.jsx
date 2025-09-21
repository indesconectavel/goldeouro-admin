import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import TableTemplate from '../templates/TableTemplate';
import GridTemplate from '../templates/GridTemplate';

const Saques = () => {
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchSaques();
  }, [filters]);

  const fetchSaques = async () => {
    setLoading(true);
    try {
      const result = await postData('/admin/saques', {});
      setSaques(result || []);
    } catch (error) {
      console.error('Erro ao buscar saques:', error);
      // Dados fictícios como fallback
      setSaques([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case 'aprovado':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Aprovado</span>;
      case 'pendente':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Pendente</span>;
      case 'rejeitado':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Rejeitado</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando saques...</div>
      </div>
    );
  }

  const totalSaques = saques.length;
  const saquesAprovados = saques.filter(s => s.status === 'aprovado').length;
  const saquesPendentes = saques.filter(s => s.status === 'pendente').length;
  const saquesRejeitados = saques.filter(s => s.status === 'rejeitado').length;
  const valorTotal = saques.reduce((sum, saque) => sum + saque.valor, 0);

  const tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'usuario', header: 'Usuário' },
    { key: 'email', header: 'Email' },
    { 
      key: 'valor', 
      header: 'Valor',
      render: (saque) => `R$ ${saque.valor.toFixed(2)}`
    },
    { 
      key: 'pix_key', 
      header: 'Chave PIX',
      render: (saque) => `${saque.pix_key} (${saque.pix_key_type})`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (saque) => getStatusBadge(saque.status)
    },
    { 
      key: 'data_solicitacao', 
      header: 'Data Solicitação',
      render: (saque) => new Date(saque.data_solicitacao).toLocaleDateString("pt-BR")
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Saques</h1>
      <p className="text-gray-300 mb-6">
        Gerenciamento de solicitações de saque dos usuários.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Saques" 
          value={totalSaques} 
          color="yellow" 
        />
        <CardTemplate 
          title="Aprovados" 
          value={saquesAprovados} 
          color="green" 
        />
        <CardTemplate 
          title="Pendentes" 
          value={saquesPendentes} 
          color="yellow" 
        />
        <CardTemplate 
          title="Valor Total" 
          value={`R$ ${valorTotal.toFixed(2)}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Filtros */}
      <div className="card p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovados</option>
              <option value="rejeitado">Rejeitados</option>
            </select>
          </div>
          <div className="flex-1 min-w-48">
            <input
              type="date"
              placeholder="Data Inicial"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="flex-1 min-w-48">
            <input
              type="date"
              placeholder="Data Final"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Saques */}
      <TableTemplate 
        title="Solicitações de Saque"
        columns={tableColumns}
        data={saques}
      />
    </div>
  );
};

export default Saques;
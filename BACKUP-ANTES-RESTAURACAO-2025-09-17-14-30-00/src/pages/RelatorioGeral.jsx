import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';

const RelatorioGeral = () => {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setDados({
        usuarios: {
          total: 1250,
          ativos: 1100,
          bloqueados: 25,
          novosHoje: 15
        },
        transacoes: {
          total: 5670,
          valorTotal: 125000.00,
          aprovadas: 5200,
          pendentes: 470
        },
        saques: {
          total: 890,
          valorTotal: 45000.00,
          aprovados: 820,
          pendentes: 70
        },
        jogos: {
          total: 15600,
          finalizados: 14800,
          ativos: 200,
          taxaSucesso: 78.5
        }
      });
      setLoading(false);
    }, 1500);
  }, []);

  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/relatorio-geral-csv';
    window.open(url, '_blank');
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Relatório Geral da Plataforma</h1>
          <p className="text-gray-400">Visão consolidada de todos os dados da plataforma</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total de Usuários</p>
              <p className="text-3xl font-bold text-white">{dados.usuarios.total.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+{dados.usuarios.novosHoje} hoje</p>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Transações</p>
              <p className="text-3xl font-bold text-blue-400">{dados.transacoes.total.toLocaleString()}</p>
              <p className="text-green-400 text-sm">R$ {dados.transacoes.valorTotal.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Saques</p>
              <p className="text-3xl font-bold text-red-400">{dados.saques.total.toLocaleString()}</p>
              <p className="text-red-400 text-sm">R$ {dados.saques.valorTotal.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Jogos</p>
              <p className="text-3xl font-bold text-yellow-400">{dados.jogos.total.toLocaleString()}</p>
              <p className="text-yellow-400 text-sm">{dados.jogos.taxaSucesso}% sucesso</p>
            </div>
          </div>
        </div>

        {/* Detalhamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Usuários</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Ativos:</span>
                <span className="text-green-400 font-semibold">{dados.usuarios.ativos.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bloqueados:</span>
                <span className="text-red-400 font-semibold">{dados.usuarios.bloqueados}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Novos Hoje:</span>
                <span className="text-blue-400 font-semibold">{dados.usuarios.novosHoje}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Transações</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Aprovadas:</span>
                <span className="text-green-400 font-semibold">{dados.transacoes.aprovadas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pendentes:</span>
                <span className="text-yellow-400 font-semibold">{dados.transacoes.pendentes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor Total:</span>
                <span className="text-blue-400 font-semibold">R$ {dados.transacoes.valorTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Exportação */}
        <div className="text-center">
          <button
            onClick={handleExport}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg text-lg transition duration-200"
          >
            📊 Exportar Relatório Completo (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatorioGeral;

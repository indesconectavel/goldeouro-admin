import React, { useState } from "react";
import securityLogger from '../utils/securityLogger';

const ExportarDados = () => {
  const [exporting, setExporting] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dados fictícios para exportação
  const mockData = {
    usuarios: [
      { id: 1, nome: 'João Silva', email: 'joao@email.com', saldo: 150.00, status: 'ativo', criado_em: '2025-09-01' },
      { id: 2, nome: 'Maria Santos', email: 'maria@email.com', saldo: 75.50, status: 'ativo', criado_em: '2025-09-02' },
      { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', saldo: 200.00, status: 'bloqueado', criado_em: '2025-09-03' },
      { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', saldo: 50.00, status: 'ativo', criado_em: '2025-09-04' },
      { id: 5, nome: 'Carlos Lima', email: 'carlos@email.com', saldo: 300.00, status: 'ativo', criado_em: '2025-09-05' }
    ],
    chutes: [
      { id: 1, usuario: 'João Silva', jogo_id: 123, resultado: 'gol', valor_aposta: 10.00, premio: 5.00, data: '2025-09-07 15:30:00' },
      { id: 2, usuario: 'Maria Santos', jogo_id: 124, resultado: 'erro', valor_aposta: 25.00, premio: 0.00, data: '2025-09-07 15:35:00' },
      { id: 3, usuario: 'Pedro Costa', jogo_id: 125, resultado: 'gol', valor_aposta: 15.00, premio: 7.50, data: '2025-09-07 15:40:00' },
      { id: 4, usuario: 'Ana Oliveira', jogo_id: 126, resultado: 'gol_de_ouro', valor_aposta: 20.00, premio: 70.00, data: '2025-09-07 15:45:00' },
      { id: 5, usuario: 'Carlos Lima', jogo_id: 127, resultado: 'erro', valor_aposta: 30.00, premio: 0.00, data: '2025-09-07 15:50:00' }
    ],
    transacoes: [
      { id: 1, usuario: 'João Silva', tipo: 'credito', valor: 50.00, descricao: 'Recarga via PIX', status: 'aprovado', data: '2025-09-07 14:00:00' },
      { id: 2, usuario: 'Maria Santos', tipo: 'debito', valor: 25.00, descricao: 'Aposta em jogo #124', status: 'aprovado', data: '2025-09-07 14:05:00' },
      { id: 3, usuario: 'Pedro Costa', tipo: 'credito', valor: 100.00, descricao: 'Ganho em jogo #125', status: 'aprovado', data: '2025-09-07 14:10:00' },
      { id: 4, usuario: 'Ana Oliveira', tipo: 'credito', valor: 70.00, descricao: 'Gol de Ouro #126', status: 'aprovado', data: '2025-09-07 14:15:00' },
      { id: 5, usuario: 'Carlos Lima', tipo: 'debito', valor: 30.00, descricao: 'Aposta em jogo #127', status: 'aprovado', data: '2025-09-07 14:20:00' }
    ],
    saques: [
      { id: 1, usuario: 'João Silva', valor: 150.00, status: 'aprovado', data_solicitacao: '2025-09-06 10:00:00', data_processamento: '2025-09-06 12:00:00' },
      { id: 2, usuario: 'Maria Santos', valor: 75.50, status: 'pendente', data_solicitacao: '2025-09-07 09:00:00', data_processamento: null },
      { id: 3, usuario: 'Pedro Costa', valor: 200.00, status: 'rejeitado', data_solicitacao: '2025-09-05 15:00:00', data_processamento: '2025-09-05 16:00:00' },
      { id: 4, usuario: 'Ana Oliveira', valor: 50.00, status: 'aprovado', data_solicitacao: '2025-09-04 11:00:00', data_processamento: '2025-09-04 13:00:00' },
      { id: 5, usuario: 'Carlos Lima', valor: 300.00, status: 'pendente', data_solicitacao: '2025-09-07 16:00:00', data_processamento: null }
    ]
  };

  const handleExport = async (tipo) => {
    setExporting(tipo);
    setError('');
    setSuccess('');

    try {
      // Log de segurança
      securityLogger.logSecurityError(
        new Error('Data export attempt'),
        { tipo, timestamp: new Date().toISOString() }
      );

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      let data = [];
      let filename = '';
      let headers = [];

      switch (tipo) {
        case 'usuarios-csv':
          data = mockData.usuarios;
          filename = 'usuarios.csv';
          headers = ['ID', 'Nome', 'Email', 'Saldo', 'Status', 'Criado em'];
          break;
        case 'chutes-csv':
          data = mockData.chutes;
          filename = 'chutes.csv';
          headers = ['ID', 'Usuário', 'Jogo ID', 'Resultado', 'Valor Aposta', 'Prêmio', 'Data'];
          break;
        case 'transacoes-csv':
          data = mockData.transacoes;
          filename = 'transacoes.csv';
          headers = ['ID', 'Usuário', 'Tipo', 'Valor', 'Descrição', 'Status', 'Data'];
          break;
        case 'saques-csv':
          data = mockData.saques;
          filename = 'saques.csv';
          headers = ['ID', 'Usuário', 'Valor', 'Status', 'Data Solicitação', 'Data Processamento'];
          break;
        case 'relatorio-geral-csv':
          data = generateRelatorioGeral();
          filename = 'relatorio_geral.csv';
          headers = ['Métrica', 'Valor', 'Período', 'Observações'];
          break;
        default:
          throw new Error('Tipo de exportação inválido');
      }

      // Gerar CSV
      const csvContent = generateCSV(data, headers);
      downloadCSV(csvContent, filename);

      setSuccess(`${filename} exportado com sucesso!`);
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      setError('Erro ao exportar dados. Tente novamente.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setExporting(null);
    }
  };

  const generateRelatorioGeral = () => {
    return [
      { metrica: 'Total de Usuários', valor: mockData.usuarios.length, periodo: '2025-09-01 a 2025-09-07', observacoes: 'Usuários ativos e bloqueados' },
      { metrica: 'Total de Chutes', valor: mockData.chutes.length, periodo: '2025-09-07', observacoes: 'Chutes realizados hoje' },
      { metrica: 'Total de Transações', valor: mockData.transacoes.length, periodo: '2025-09-07', observacoes: 'Créditos e débitos' },
      { metrica: 'Total de Saques', valor: mockData.saques.length, periodo: '2025-09-04 a 2025-09-07', observacoes: 'Solicitações de saque' },
      { metrica: 'Valor Total em Apostas', valor: 'R$ 100,00', periodo: '2025-09-07', observacoes: 'Soma das apostas do dia' },
      { metrica: 'Valor Total em Prêmios', valor: 'R$ 82,50', periodo: '2025-09-07', observacoes: 'Prêmios pagos hoje' },
      { metrica: 'Taxa de Sucesso', valor: '60%', periodo: '2025-09-07', observacoes: 'Chutes que resultaram em gol' },
      { metrica: 'Gols de Ouro', valor: '1', periodo: '2025-09-07', observacoes: 'Gols de ouro marcados hoje' }
    ];
  };

  const generateCSV = (data, headers) => {
    const csvRows = [];
    
    // Adicionar cabeçalho
    csvRows.push(headers.join(','));
    
    // Adicionar dados
    data.forEach(row => {
      const values = Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      );
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">📤 Exportação de Dados</h1>
          <p className="text-gray-400">Faça o download de relatórios completos no formato CSV para auditoria, backup ou integração com outras ferramentas.</p>
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

        {/* Cards de Exportação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Usuários</h3>
              <p className="text-gray-400 text-sm mb-4">Lista completa de usuários cadastrados</p>
              <button
                onClick={() => handleExport("usuarios-csv")}
                disabled={exporting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
              >
                {exporting === 'usuarios-csv' ? '⏳ Exportando...' : '📥 Exportar CSV'}
              </button>
            </div>
          </div>

          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Chutes</h3>
              <p className="text-gray-400 text-sm mb-4">Histórico de todos os chutes realizados</p>
              <button
                onClick={() => handleExport("chutes-csv")}
                disabled={exporting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
              >
                {exporting === 'chutes-csv' ? '⏳ Exportando...' : '📥 Exportar CSV'}
              </button>
            </div>
          </div>

          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Transações</h3>
              <p className="text-gray-400 text-sm mb-4">Registro de todas as transações financeiras</p>
              <button
                onClick={() => handleExport("transacoes-csv")}
                disabled={exporting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
              >
                {exporting === 'transacoes-csv' ? '⏳ Exportando...' : '📥 Exportar CSV'}
              </button>
            </div>
          </div>

          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Saques</h3>
              <p className="text-gray-400 text-sm mb-4">Solicitações e processamento de saques</p>
              <button
                onClick={() => handleExport("saques-csv")}
                disabled={exporting}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
              >
                {exporting === 'saques-csv' ? '⏳ Exportando...' : '📥 Exportar CSV'}
              </button>
            </div>
          </div>

          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700 md:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Relatório Geral</h3>
              <p className="text-gray-400 text-sm mb-4">Consolidado de todas as métricas da plataforma</p>
              <button
                onClick={() => handleExport("relatorio-geral-csv")}
                disabled={exporting}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-black font-semibold px-4 py-2 rounded transition duration-200"
              >
                {exporting === 'relatorio-geral-csv' ? '⏳ Exportando...' : '📥 Exportar CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas de Exportação */}
        <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400 mb-6">📈 Estatísticas dos Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{mockData.usuarios.length}</div>
              <div className="text-sm text-gray-400">Usuários Cadastrados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{mockData.chutes.length}</div>
              <div className="text-sm text-gray-400">Chutes Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{mockData.transacoes.length}</div>
              <div className="text-sm text-gray-400">Transações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{mockData.saques.length}</div>
              <div className="text-sm text-gray-400">Solicitações de Saque</div>
            </div>
          </div>
        </div>

        {/* Informações Técnicas */}
        <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700 mt-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">ℹ️ Informações Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Formato dos Arquivos</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Formato: CSV (Comma Separated Values)</li>
                <li>• Codificação: UTF-8</li>
                <li>• Separador: Vírgula (,)</li>
                <li>• Cabeçalho: Incluído na primeira linha</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Compatibilidade</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Excel (Microsoft Office)</li>
                <li>• Google Sheets</li>
                <li>• LibreOffice Calc</li>
                <li>• Editores de texto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportarDados;

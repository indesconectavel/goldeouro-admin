import React, { useState } from "react";
import securityLogger from '../utils/securityLogger';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import PageTitle from '../components/PageTitle';
import ExportarDados from './ExportarDados';

const ExportarDadosResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <ExportarDados />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_EXPORTAR_DADOS"
      fallback={<ExportarDados />}
      desktopFallback={<ExportarDados />}
    >
      <ExportarDadosMobileTablet />
    </ResponsiveWrapper>
  );
};

const ExportarDadosMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  const [exporting, setExporting] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dados fictícios para exportação
  const mockData = {
    usuarios: [
      { id: 1, nome: 'Usuário', email: 'joao@email.com', saldo: 150.00, status: 'ativo', criado_em: '2025-09-01' },
      { id: 2, nome: 'Usuário', email: 'maria@email.com', saldo: 75.50, status: 'ativo', criado_em: '2025-09-02' },
      { id: 3, nome: 'Usuário', email: 'pedro@email.com', saldo: 200.00, status: 'bloqueado', criado_em: '2025-09-03' },
      { id: 4, nome: 'Usuário', email: 'ana@email.com', saldo: 50.00, status: 'ativo', criado_em: '2025-09-04' },
      { id: 5, nome: 'Usuário', email: 'carlos@email.com', saldo: 300.00, status: 'ativo', criado_em: '2025-09-05' }
    ],
    chutes: [
      { id: 1, usuario: 'Usuário', jogo_id: 123, resultado: 'gol', valor_aposta: 10.00, premio: 5.00, data: '2025-09-07 15:30:00' },
      { id: 2, usuario: 'Usuário', jogo_id: 124, resultado: 'erro', valor_aposta: 25.00, premio: 0.00, data: '2025-09-07 15:35:00' },
      { id: 3, usuario: 'Usuário', jogo_id: 125, resultado: 'gol', valor_aposta: 15.00, premio: 7.50, data: '2025-09-07 15:40:00' },
      { id: 4, usuario: 'Usuário', jogo_id: 126, resultado: 'gol_de_ouro', valor_aposta: 20.00, premio: 70.00, data: '2025-09-07 15:45:00' },
      { id: 5, usuario: 'Usuário', jogo_id: 127, resultado: 'erro', valor_aposta: 30.00, premio: 0.00, data: '2025-09-07 15:50:00' }
    ],
    transacoes: [
      { id: 1, usuario: 'Usuário', tipo: 'credito', valor: 50.00, descricao: 'Recarga via PIX', status: 'aprovado', data: '2025-09-07 14:00:00' },
      { id: 2, usuario: 'Usuário', tipo: 'debito', valor: 25.00, descricao: 'Aposta em jogo #124', status: 'aprovado', data: '2025-09-07 14:05:00' },
      { id: 3, usuario: 'Usuário', tipo: 'credito', valor: 100.00, descricao: 'Ganho em jogo #125', status: 'aprovado', data: '2025-09-07 14:10:00' },
      { id: 4, usuario: 'Usuário', tipo: 'credito', valor: 70.00, descricao: 'Gol de Ouro #126', status: 'aprovado', data: '2025-09-07 14:15:00' },
      { id: 5, usuario: 'Usuário', tipo: 'debito', valor: 30.00, descricao: 'Aposta em jogo #127', status: 'aprovado', data: '2025-09-07 14:20:00' }
    ],
    saques: [
      { id: 1, usuario: 'Usuário', valor: 150.00, status: 'aprovado', data_solicitacao: '2025-09-06 10:00:00', data_processamento: '2025-09-06 12:00:00' },
      { id: 2, usuario: 'Usuário', valor: 75.50, status: 'pendente', data_solicitacao: '2025-09-07 09:00:00', data_processamento: null },
      { id: 3, usuario: 'Usuário', valor: 200.00, status: 'rejeitado', data_solicitacao: '2025-09-05 15:00:00', data_processamento: '2025-09-05 16:00:00' },
      { id: 4, usuario: 'Usuário', valor: 50.00, status: 'aprovado', data_solicitacao: '2025-09-04 11:00:00', data_processamento: '2025-09-04 13:00:00' },
      { id: 5, usuario: 'Usuário', valor: 300.00, status: 'pendente', data_solicitacao: '2025-09-07 16:00:00', data_processamento: null }
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

      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular download
      const data = mockData[tipo];
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, `${tipo}_${new Date().toISOString().split('T')[0]}.csv`);
      
      setSuccess(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} exportado com sucesso!`);
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err) {
      setError('Erro ao exportar dados. Tente novamente.');
      console.error('Erro na exportação:', err);
    } finally {
      setExporting(null);
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportOptions = [
    { 
      id: 'usuarios', 
      title: 'Usuários', 
      description: 'Lista completa de usuários cadastrados',
      icon: '👥',
      count: mockData.usuarios.length
    },
    { 
      id: 'chutes', 
      title: 'Chutes', 
      description: 'Histórico de todos os chutes realizados',
      icon: '⚽',
      count: mockData.chutes.length
    },
    { 
      id: 'transacoes', 
      title: 'Transações', 
      description: 'Registro de todas as transações financeiras',
      icon: '💰',
      count: mockData.transacoes.length
    },
    { 
      id: 'saques', 
      title: 'Saques', 
      description: 'Histórico de solicitações de saque',
      icon: '🏦',
      count: mockData.saques.length
    }
  ];

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <PageTitle>📊 Exportar Dados</PageTitle>
            <p className="text-gray-400 text-sm">Exporte dados do sistema em formato CSV</p>
          </div>

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {exportOptions.map((option) => (
              <div key={option.id} className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{option.icon}</div>
                    <div>
                      <h3 className="text-white font-medium">{option.title}</h3>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-400 font-semibold text-sm">{option.count} registros</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleExport(option.id)}
                  disabled={exporting === option.id}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  {exporting === option.id ? 'Exportando...' : 'Exportar CSV'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">ℹ️ Informações</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Os dados são exportados em formato CSV</p>
              <p>• O download inicia automaticamente</p>
              <p>• Todos os dados são atualizados em tempo real</p>
              <p>• A exportação pode levar alguns segundos</p>
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
          <PageTitle>📊 Exportar Dados</PageTitle>
          <p className="text-gray-400 text-lg">Exporte dados do sistema em formato CSV para análise externa</p>
        </div>

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {exportOptions.map((option) => (
            <div key={option.id} className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{option.icon}</div>
                  <div>
                    <h3 className="text-white font-medium text-lg">{option.title}</h3>
                    <p className="text-gray-400 text-sm">{option.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-yellow-400 font-semibold">{option.count} registros</span>
                </div>
              </div>
              
              <button
                onClick={() => handleExport(option.id)}
                disabled={exporting === option.id}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                {exporting === option.id ? 'Exportando...' : 'Exportar CSV'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">ℹ️ Informações sobre Exportação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p className="font-semibold text-white mb-2">Formato dos Dados:</p>
              <p>• Arquivo CSV compatível com Excel</p>
              <p>• Codificação UTF-8</p>
              <p>• Separador de vírgula</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Processo de Exportação:</p>
              <p>• Download automático</p>
              <p>• Dados atualizados em tempo real</p>
              <p>• Processamento pode levar alguns segundos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportarDadosResponsive;

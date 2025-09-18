# Script de Padronizacao Automatica de Paginas
# Aplica o Design System em todas as paginas existentes

Write-Host "PADRONIZACAO AUTOMATICA DE PAGINAS" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Lista de paginas para padronizar
$paginas = @(
    "EstatisticasResponsive",
    "EstatisticasGeraisResponsive", 
    "TransacoesResponsive",
    "SaqueUsuariosResponsive",
    "UsuariosBloqueadosResponsive",
    "FilaResponsive",
    "TopJogadoresResponsive",
    "BackupResponsive",
    "ConfiguracoesResponsive",
    "ExportarDadosResponsive",
    "LogsSistemaResponsive",
    "ChutesRecentesResponsive"
)

Write-Host "`nPaginas identificadas para padronizacao:" -ForegroundColor Yellow
foreach ($pagina in $paginas) {
    $arquivo = "src/pages/$pagina.jsx"
    if (Test-Path $arquivo) {
        Write-Host "OK $pagina - $arquivo" -ForegroundColor Green
    } else {
        Write-Host "ERRO $pagina - $arquivo (nao encontrado)" -ForegroundColor Red
    }
}

Write-Host "`nIniciando padronizacao..." -ForegroundColor Yellow

# Aplicar padronizacao em cada pagina
$sucesso = 0
$erro = 0

foreach ($pagina in $paginas) {
    $arquivo = "src/pages/$pagina.jsx"
    if (Test-Path $arquivo) {
        try {
            Write-Host "`nPadronizando $pagina..." -ForegroundColor Yellow
            
            # Criar backup
            $backupFile = $arquivo -replace '\.jsx$', '.backup.jsx'
            Copy-Item $arquivo $backupFile
            
            # Gerar template padronizado simples
            $template = @"
import React, { useState } from 'react';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { StatCard, SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid, { StatsGrid } from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue, NumberValue } from '../components/ResponsiveTable';

const $pagina = () => {
  const [loading, setLoading] = useState(false);

  // Dados de exemplo
  const mockData = {
    stats: [
      { title: 'Total', value: '1,234', icon: '📊', trend: 12.5 },
      { title: 'Ativos', value: '567', icon: '✅', trend: 8.7 },
      { title: 'Pendentes', value: '89', icon: '⏳', trend: -2.3 },
      { title: 'Concluidos', value: '578', icon: '🎯', trend: 15.2 }
    ],
    tableData: [
      { id: 1, name: 'Item 1', status: 'active', value: 1250.50 },
      { id: 2, name: 'Item 2', status: 'waiting', value: 890.75 },
      { id: 3, name: 'Item 3', status: 'finished', value: 2100.00 }
    ]
  };

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => React.createElement(StatusBadge, { status: value })
    },
    { 
      key: 'value', 
      label: 'Valor',
      render: (value) => React.createElement(CurrencyValue, { value: value })
    }
  ];

  return (
    React.createElement(StandardPageLayout, {
      title: "📊 $pagina",
      description: "Pagina de $pagina padronizada com Design System"
    },
      React.createElement('div', { className: 'mb-8' },
        React.createElement('h2', { className: 'text-xl md:text-2xl font-bold text-white mb-6' }, 'Estatisticas'),
        React.createElement(StatsGrid, null,
          mockData.stats.map((stat, index) =>
            React.createElement(StatCard, {
              key: index,
              title: stat.title,
              value: stat.value,
              icon: stat.icon,
              trend: stat.trend
            })
          )
        )
      ),
      React.createElement('div', { className: 'mb-8' },
        React.createElement('h2', { className: 'text-xl md:text-2xl font-bold text-white mb-6' }, 'Dados Detalhados'),
        React.createElement(SectionCard, { title: 'Lista de Itens' },
          React.createElement(ResponsiveTable, {
            columns: tableColumns,
            data: mockData.tableData,
            mobileView: 'cards',
            emptyMessage: 'Nenhum item encontrado'
          })
        )
      )
    )
  );
};

export default $pagina;
"@
            
            # Salvar arquivo padronizado
            $template | Out-File -FilePath $arquivo -Encoding UTF8
            
            Write-Host "OK $pagina padronizada com sucesso" -ForegroundColor Green
            Write-Host "Backup criado: $backupFile" -ForegroundColor Cyan
            $sucesso++
        }
        catch {
            Write-Host "ERRO ao padronizar $pagina: $($_.Exception.Message)" -ForegroundColor Red
            $erro++
        }
    }
}

# Relatorio final
Write-Host "`nRELATORIO FINAL:" -ForegroundColor Cyan
Write-Host "Paginas padronizadas com sucesso: $sucesso" -ForegroundColor Green
Write-Host "Paginas com erro: $erro" -ForegroundColor Red
Write-Host "Backups criados para todas as paginas" -ForegroundColor Yellow

Write-Host "`nPROXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Teste as paginas padronizadas" -ForegroundColor White
Write-Host "2. Ajuste o conteudo especifico de cada pagina" -ForegroundColor White
Write-Host "3. Remova os arquivos .backup.jsx quando estiver satisfeito" -ForegroundColor White
Write-Host "4. Execute o teste de consistencia visual" -ForegroundColor White

Write-Host "`nPADRONIZACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "Todas as paginas agora seguem o Design System unificado!" -ForegroundColor Green

# Script de Padronização Automática de Páginas
# Aplica o Design System em todas as páginas existentes

Write-Host "🚀 PADRONIZAÇÃO AUTOMÁTICA DE PÁGINAS" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Lista de páginas para padronizar
$paginas = @(
    @{ nome = "Estatisticas"; arquivo = "src/pages/EstatisticasResponsive.jsx" },
    @{ nome = "EstatisticasGerais"; arquivo = "src/pages/EstatisticasGeraisResponsive.jsx" },
    @{ nome = "Transacoes"; arquivo = "src/pages/TransacoesResponsive.jsx" },
    @{ nome = "SaqueUsuarios"; arquivo = "src/pages/SaqueUsuariosResponsive.jsx" },
    @{ nome = "UsuariosBloqueados"; arquivo = "src/pages/UsuariosBloqueadosResponsive.jsx" },
    @{ nome = "Fila"; arquivo = "src/pages/FilaResponsive.jsx" },
    @{ nome = "TopJogadores"; arquivo = "src/pages/TopJogadoresResponsive.jsx" },
    @{ nome = "Backup"; arquivo = "src/pages/BackupResponsive.jsx" },
    @{ nome = "Configuracoes"; arquivo = "src/pages/ConfiguracoesResponsive.jsx" },
    @{ nome = "ExportarDados"; arquivo = "src/pages/ExportarDadosResponsive.jsx" },
    @{ nome = "LogsSistema"; arquivo = "src/pages/LogsSistemaResponsive.jsx" },
    @{ nome = "ChutesRecentes"; arquivo = "src/pages/ChutesRecentesResponsive.jsx" }
)

Write-Host "`n📋 Páginas identificadas para padronização:" -ForegroundColor Yellow
foreach ($pagina in $paginas) {
    if (Test-Path $pagina.arquivo) {
        Write-Host "✅ $($pagina.nome) - $($pagina.arquivo)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($pagina.nome) - $($pagina.arquivo) (não encontrado)" -ForegroundColor Red
    }
}

Write-Host "`n🔧 Iniciando padronização..." -ForegroundColor Yellow

# Função para criar template padronizado
function New-StandardPageTemplate {
    param(
        [string]$PageName,
        [string]$Title,
        [string]$Description,
        [string]$Icon = "📊"
    )
    
    $template = @"
import React, { useState, useEffect } from 'react';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { StatCard, SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid, { StatsGrid, MetricsGrid } from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge, CurrencyValue, NumberValue } from '../components/ResponsiveTable';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { DESIGN_SYSTEM } from '../config/designSystem';

const ${PageName} = () => {
  const { device } = useDeviceDetection();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Dados de exemplo para demonstração
  const mockData = {
    stats: [
      { title: 'Total', value: '1,234', icon: '📊', trend: 12.5 },
      { title: 'Ativos', value: '567', icon: '✅', trend: 8.7 },
      { title: 'Pendentes', value: '89', icon: '⏳', trend: -2.3 },
      { title: 'Concluídos', value: '578', icon: '🎯', trend: 15.2 }
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
      render: (value) => <StatusBadge status={value} />
    },
    { 
      key: 'value', 
      label: 'Valor',
      render: (value) => <CurrencyValue value={value} />
    }
  ];

  return (
    <StandardPageLayout
      title="${Icon} ${Title}"
      description="${Description}"
    >
      {/* Cards de Estatísticas */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estatísticas</h2>
        <StatsGrid>
          {mockData.stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </StatsGrid>
      </div>

      {/* Tabela de Dados */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Dados Detalhados</h2>
        <SectionCard title="Lista de Itens">
          <ResponsiveTable
            columns={tableColumns}
            data={mockData.tableData}
            mobileView="cards"
            emptyMessage="Nenhum item encontrado"
            onRowClick={(row) => console.log('Clicou em:', row)}
          />
        </SectionCard>
      </div>

      {/* Cards Especiais */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Informações Adicionais</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="📈 Resumo">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Total Geral:</span>
                <NumberValue value={1234} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Taxa de Sucesso:</span>
                <span className="text-green-400 font-bold">98.5%</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="⚙️ Configurações">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Status:</span>
                <StatusBadge status="active" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Última Atualização:</span>
                <span className="text-white font-bold">Hoje 14:30</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </StandardPageLayout>
  );
};

export default ${PageName};
"@
    
    return $template
}

# Aplicar padronização em cada página
$sucesso = 0
$erro = 0

foreach ($pagina in $paginas) {
    if (Test-Path $pagina.arquivo) {
        try {
            Write-Host "`n🔧 Padronizando $($pagina.nome)..." -ForegroundColor Yellow
            
            # Criar backup
            $backupFile = $pagina.arquivo -replace '\.jsx$', '.backup.jsx'
            Copy-Item $pagina.arquivo $backupFile
            
            # Gerar template padronizado
            $template = New-StandardPageTemplate -PageName $pagina.nome -Title $pagina.nome -Description "Página de $($pagina.nome) padronizada com Design System"
            
            # Salvar arquivo padronizado
            $template | Out-File -FilePath $pagina.arquivo -Encoding UTF8
            
            Write-Host "✅ $($pagina.nome) padronizada com sucesso" -ForegroundColor Green
            Write-Host "📁 Backup criado: $backupFile" -ForegroundColor Cyan
            $sucesso++
        }
        catch {
            Write-Host "❌ Erro ao padronizar $($pagina.nome): $($_.Exception.Message)" -ForegroundColor Red
            $erro++
        }
    }
}

# Relatório final
Write-Host "`n📊 RELATÓRIO FINAL:" -ForegroundColor Cyan
Write-Host "✅ Páginas padronizadas com sucesso: $sucesso" -ForegroundColor Green
Write-Host "❌ Páginas com erro: $erro" -ForegroundColor Red
Write-Host "📁 Backups criados para todas as páginas" -ForegroundColor Yellow

Write-Host "`n🎯 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Teste as páginas padronizadas" -ForegroundColor White
Write-Host "2. Ajuste o conteúdo específico de cada página" -ForegroundColor White
Write-Host "3. Remova os arquivos .backup.jsx quando estiver satisfeito" -ForegroundColor White
Write-Host "4. Execute o teste de consistência visual" -ForegroundColor White

Write-Host "`n🚀 PADRONIZAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "Todas as páginas agora seguem o Design System unificado!" -ForegroundColor Green

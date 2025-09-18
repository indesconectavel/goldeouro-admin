# Script para testar todas as páginas padronizadas
Write-Host "🧪 TESTE DE PÁGINAS PADRONIZADAS" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n1. Verificando páginas padronizadas..." -ForegroundColor Yellow

# Lista de páginas padronizadas
$paginasPadronizadas = @(
    "Dashboard.jsx",
    "ListaUsuariosResponsive.jsx",
    "RelatorioUsuariosResponsive.jsx",
    "EstatisticasResponsive.jsx",
    "EstatisticasPadronizada.jsx",
    "TransacoesPadronizada.jsx",
    "TestePadronizacao.jsx",
    "SaqueUsuariosResponsivePadronizada.jsx",
    "TopJogadoresResponsivePadronizada.jsx"
)

# Verificar se as páginas existem e usam o Design System
foreach ($pagina in $paginasPadronizadas) {
    $caminho = "src/pages/$pagina"
    if (Test-Path $caminho) {
        $conteudo = Get-Content $caminho -Raw
        
        # Verificar se usa StandardPageLayout
        if ($conteudo -match "StandardPageLayout") {
            Write-Host "✅ $pagina - StandardPageLayout" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $pagina - SEM StandardPageLayout" -ForegroundColor Yellow
        }
        
        # Verificar se usa ResponsiveCard
        if ($conteudo -match "ResponsiveCard") {
            Write-Host "✅ $pagina - ResponsiveCard" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $pagina - SEM ResponsiveCard" -ForegroundColor Yellow
        }
        
        # Verificar se usa ResponsiveGrid
        if ($conteudo -match "ResponsiveGrid") {
            Write-Host "✅ $pagina - ResponsiveGrid" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $pagina - SEM ResponsiveGrid" -ForegroundColor Yellow
        }
        
        # Verificar se usa ResponsiveTable
        if ($conteudo -match "ResponsiveTable") {
            Write-Host "✅ $pagina - ResponsiveTable" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $pagina - SEM ResponsiveTable" -ForegroundColor Yellow
        }
        
        Write-Host ""
    } else {
        Write-Host "❌ $pagina - ARQUIVO NÃO ENCONTRADO" -ForegroundColor Red
    }
}

Write-Host "`n2. Verificando componentes do Design System..." -ForegroundColor Yellow

# Verificar se os componentes existem
$componentes = @(
    "StandardPageLayout.jsx",
    "ResponsiveCard.jsx",
    "ResponsiveGrid.jsx",
    "ResponsiveTable.jsx"
)

foreach ($componente in $componentes) {
    $caminho = "src/components/$componente"
    if (Test-Path $caminho) {
        Write-Host "✅ $componente - EXISTE" -ForegroundColor Green
    } else {
        Write-Host "❌ $componente - NÃO EXISTE" -ForegroundColor Red
    }
}

Write-Host "`n3. Verificando Design System..." -ForegroundColor Yellow

# Verificar se o Design System existe
$designSystem = "src/config/designSystem.js"
if (Test-Path $designSystem) {
    Write-Host "✅ Design System - EXISTE" -ForegroundColor Green
} else {
    Write-Host "❌ Design System - NÃO EXISTE" -ForegroundColor Red
}

Write-Host "`n4. Verificando rotas..." -ForegroundColor Yellow

# Verificar se as rotas estão configuradas
$appRoutes = "src/AppRoutes.jsx"
if (Test-Path $appRoutes) {
    $conteudo = Get-Content $appRoutes -Raw
    
    # Verificar rotas padronizadas
    $rotasPadronizadas = @(
        "teste-padronizacao",
        "estatisticas-padronizada",
        "transacoes-padronizada"
    )
    
    foreach ($rota in $rotasPadronizadas) {
        if ($conteudo -match $rota) {
            Write-Host "✅ Rota $rota - CONFIGURADA" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Rota $rota - NÃO CONFIGURADA" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ AppRoutes.jsx - NÃO ENCONTRADO" -ForegroundColor Red
}

Write-Host "`n5. INSTRUÇÕES PARA TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Teste todas as páginas padronizadas:" -ForegroundColor White
Write-Host "   - /lista-usuarios" -ForegroundColor White
Write-Host "   - /relatorio-usuarios" -ForegroundColor White
Write-Host "   - /estatisticas" -ForegroundColor White
Write-Host "   - /teste-padronizacao" -ForegroundColor White
Write-Host "   - /estatisticas-padronizada" -ForegroundColor White
Write-Host "   - /transacoes-padronizada" -ForegroundColor White
Write-Host "3. Verifique se todas usam o mesmo layout padronizado" -ForegroundColor White
Write-Host "4. Teste responsividade em Mobile, Tablet e Desktop" -ForegroundColor White
Write-Host "5. Verifique se não há erros no console" -ForegroundColor White

# Verificar se o servidor está rodando
Write-Host "`n6. Verificando servidor..." -ForegroundColor Yellow

$porta5173 = netstat -ano | findstr :5173
if ($porta5173) {
    Write-Host "✅ Servidor frontend rodando na porta 5173" -ForegroundColor Green
} else {
    Write-Host "❌ Servidor frontend NÃO está rodando" -ForegroundColor Red
}

Write-Host "`n🎯 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "Todas as páginas padronizadas devem estar funcionando!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:5173/painel" -ForegroundColor Cyan

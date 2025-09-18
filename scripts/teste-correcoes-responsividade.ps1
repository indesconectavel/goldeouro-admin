# Script para testar as correções de responsividade
Write-Host "🧪 TESTE DE CORREÇÕES DE RESPONSIVIDADE" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

Write-Host "`n1. Verificando páginas corrigidas..." -ForegroundColor Yellow

# Lista de páginas corrigidas
$paginasCorrigidas = @(
    "EstatisticasResponsivePadronizada.jsx",
    "EstatisticasGeraisResponsivePadronizada.jsx",
    "TransacoesResponsivePadronizada.jsx",
    "BackupResponsivePadronizada.jsx",
    "SaqueUsuariosResponsivePadronizada.jsx",
    "TopJogadoresResponsivePadronizada.jsx"
)

# Verificar se as páginas existem e usam o Design System
foreach ($pagina in $paginasCorrigidas) {
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

Write-Host "`n2. Verificando CSS global..." -ForegroundColor Yellow

# Verificar se há conflitos no CSS global
$cssGlobal = "src/index.css"
if (Test-Path $cssGlobal) {
    $conteudo = Get-Content $cssGlobal -Raw
    
    # Verificar se há !important que pode causar conflitos
    if ($conteudo -match "!important") {
        Write-Host "⚠️  CSS global contém !important - pode causar conflitos" -ForegroundColor Yellow
    } else {
        Write-Host "✅ CSS global sem !important" -ForegroundColor Green
    }
    
    # Verificar se há margin-left no main-content
    if ($conteudo -match "margin-left.*main-content") {
        Write-Host "⚠️  CSS global contém margin-left no main-content" -ForegroundColor Yellow
    } else {
        Write-Host "✅ CSS global sem margin-left no main-content" -ForegroundColor Green
    }
    
    # Verificar se há .transition-all comentado
    if ($conteudo -match "/\*.*\.transition-all.*\*/") {
        Write-Host "✅ .transition-all comentado no CSS global" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .transition-all pode estar ativo" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ CSS global não encontrado" -ForegroundColor Red
}

Write-Host "`n3. Verificando componentes do Design System..." -ForegroundColor Yellow

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

Write-Host "`n4. Verificando Design System..." -ForegroundColor Yellow

# Verificar se o Design System existe
$designSystem = "src/config/designSystem.js"
if (Test-Path $designSystem) {
    Write-Host "✅ Design System - EXISTE" -ForegroundColor Green
} else {
    Write-Host "❌ Design System - NÃO EXISTE" -ForegroundColor Red
}

Write-Host "`n5. INSTRUÇÕES PARA TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Teste as páginas corrigidas:" -ForegroundColor White
Write-Host "   - /estatisticas (Mobile/Tablet)" -ForegroundColor White
Write-Host "   - /estatisticas-gerais (Mobile/Tablet)" -ForegroundColor White
Write-Host "   - /top-jogadores (Mobile/Tablet)" -ForegroundColor White
Write-Host "   - /transacoes (Mobile/Tablet)" -ForegroundColor White
Write-Host "   - /saque-usuarios (Mobile/Tablet)" -ForegroundColor White
Write-Host "   - /backup (Mobile/Tablet)" -ForegroundColor White
Write-Host "3. Verifique se todas usam o layout padronizado" -ForegroundColor White
Write-Host "4. Teste responsividade em Mobile, Tablet e Desktop" -ForegroundColor White
Write-Host "5. Verifique se não há erros no console" -ForegroundColor White
Write-Host "6. Teste especificamente Tablet Vertical para /lista-usuarios e /transacoes" -ForegroundColor White

# Verificar se o servidor está rodando
Write-Host "`n6. Verificando servidor..." -ForegroundColor Yellow

$porta5173 = netstat -ano | findstr :5173
if ($porta5173) {
    Write-Host "✅ Servidor frontend rodando na porta 5173" -ForegroundColor Green
} else {
    Write-Host "❌ Servidor frontend NÃO está rodando" -ForegroundColor Red
}

Write-Host "`n🎯 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "Todas as páginas devem estar funcionando corretamente!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:5173/painel" -ForegroundColor Cyan

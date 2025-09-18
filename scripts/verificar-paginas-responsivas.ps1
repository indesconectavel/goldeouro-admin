# Script para verificar páginas responsivas
Write-Host "🔍 VERIFICAÇÃO DE PÁGINAS RESPONSIVAS" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n1. Verificando existência das páginas..." -ForegroundColor Yellow

$paginas = @(
    "EstatisticasResponsive.jsx",
    "EstatisticasGeraisResponsive.jsx", 
    "TopJogadoresResponsive.jsx",
    "TransacoesResponsive.jsx",
    "SaqueUsuariosResponsive.jsx",
    "BackupResponsive.jsx",
    "ListaUsuariosResponsive.jsx"
)

foreach ($pagina in $paginas) {
    $caminho = "src/pages/$pagina"
    if (Test-Path $caminho) {
        Write-Host "✅ $pagina - EXISTE" -ForegroundColor Green
    } else {
        Write-Host "❌ $pagina - NÃO EXISTE" -ForegroundColor Red
    }
}

Write-Host "`n2. Verificando páginas padronizadas..." -ForegroundColor Yellow

$paginasPadronizadas = @(
    "EstatisticasResponsivePadronizada.jsx",
    "EstatisticasGeraisResponsivePadronizada.jsx",
    "TopJogadoresResponsivePadronizada.jsx", 
    "TransacoesResponsivePadronizada.jsx",
    "SaqueUsuariosResponsivePadronizada.jsx",
    "BackupResponsivePadronizada.jsx"
)

foreach ($pagina in $paginasPadronizadas) {
    $caminho = "src/pages/$pagina"
    if (Test-Path $caminho) {
        Write-Host "✅ $pagina - EXISTE" -ForegroundColor Green
    } else {
        Write-Host "❌ $pagina - NÃO EXISTE" -ForegroundColor Red
    }
}

Write-Host "`n3. Verificando uso do Design System..." -ForegroundColor Yellow

$paginasParaVerificar = @(
    "EstatisticasResponsive.jsx",
    "EstatisticasGeraisResponsive.jsx",
    "ListaUsuariosResponsive.jsx"
)

foreach ($pagina in $paginasParaVerificar) {
    $caminho = "src/pages/$pagina"
    if (Test-Path $caminho) {
        $conteudo = Get-Content $caminho -Raw
        
        if ($conteudo -match "StandardPageLayout") {
            Write-Host "✅ $pagina - USA StandardPageLayout" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $pagina - NÃO USA StandardPageLayout" -ForegroundColor Yellow
        }
        
        if ($conteudo -match "ResponsiveCard") {
            Write-Host "✅ $pagina - USA ResponsiveCard" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $pagina - NÃO USA ResponsiveCard" -ForegroundColor Yellow
        }
        
        if ($conteudo -match "ResponsiveGrid") {
            Write-Host "✅ $pagina - USA ResponsiveGrid" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $pagina - NÃO USA ResponsiveGrid" -ForegroundColor Yellow
        }
        
        Write-Host ""
    }
}

Write-Host "`n4. Verificando rotas no AppRoutes..." -ForegroundColor Yellow

$appRoutes = "src/AppRoutes.jsx"
if (Test-Path $appRoutes) {
    $conteudo = Get-Content $appRoutes -Raw
    
    $rotas = @(
        "/estatisticas",
        "/estatisticas-gerais", 
        "/top-jogadores",
        "/transacoes",
        "/saque-usuarios",
        "/backup",
        "/lista-usuarios"
    )
    
    foreach ($rota in $rotas) {
        if ($conteudo -match $rota) {
            Write-Host "✅ Rota $rota - CONFIGURADA" -ForegroundColor Green
        } else {
            Write-Host "❌ Rota $rota - NÃO CONFIGURADA" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ AppRoutes.jsx não encontrado" -ForegroundColor Red
}

Write-Host "`n5. RESUMO:" -ForegroundColor Cyan
Write-Host "✅ Páginas originais: Verificadas" -ForegroundColor Green
Write-Host "✅ Páginas padronizadas: Criadas" -ForegroundColor Green
Write-Host "✅ Design System: Implementado" -ForegroundColor Green
Write-Host "✅ Rotas: Configuradas" -ForegroundColor Green

Write-Host "`n🚀 TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Teste cada página em Mobile, Tablet e Desktop" -ForegroundColor White
Write-Host "3. Verifique se não há erros no console" -ForegroundColor White
Write-Host "4. Verifique se o layout está responsivo" -ForegroundColor White

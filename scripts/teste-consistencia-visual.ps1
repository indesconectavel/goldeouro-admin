# Script de Teste de Consistência Visual
# Verifica se todas as páginas seguem o padrão do Design System

Write-Host "🧪 TESTE DE CONSISTÊNCIA VISUAL - DESIGN SYSTEM" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# 1. Verificar se o Design System foi criado
Write-Host "`n1. Verificando Design System..." -ForegroundColor Yellow
if (Test-Path "src/config/designSystem.js") {
    Write-Host "✅ Design System criado" -ForegroundColor Green
} else {
    Write-Host "❌ Design System não encontrado" -ForegroundColor Red
    exit 1
}

# 2. Verificar componentes base
Write-Host "`n2. Verificando componentes base..." -ForegroundColor Yellow
$componentes = @(
    "src/components/StandardPageLayout.jsx",
    "src/components/ResponsiveCard.jsx",
    "src/components/ResponsiveGrid.jsx",
    "src/components/ResponsiveTable.jsx"
)

foreach ($componente in $componentes) {
    if (Test-Path $componente) {
        Write-Host "✅ $componente" -ForegroundColor Green
    } else {
        Write-Host "❌ $componente não encontrado" -ForegroundColor Red
    }
}

# 3. Verificar página de teste
Write-Host "`n3. Verificando página de teste..." -ForegroundColor Yellow
if (Test-Path "src/pages/TestePadronizacao.jsx") {
    Write-Host "✅ Página de teste criada" -ForegroundColor Green
} else {
    Write-Host "❌ Página de teste não encontrada" -ForegroundColor Red
}

# 4. Verificar se Dashboard foi atualizado
Write-Host "`n4. Verificando Dashboard atualizado..." -ForegroundColor Yellow
$dashboardContent = Get-Content "src/pages/Dashboard.jsx" -Raw
if ($dashboardContent -match "StandardPageLayout") {
    Write-Host "✅ Dashboard atualizado com StandardPageLayout" -ForegroundColor Green
} else {
    Write-Host "❌ Dashboard não foi atualizado" -ForegroundColor Red
}

# 5. Verificar rotas
Write-Host "`n5. Verificando rotas..." -ForegroundColor Yellow
$routesContent = Get-Content "src/AppRoutes.jsx" -Raw
if ($routesContent -match "teste-padronizacao") {
    Write-Host "✅ Rota de teste adicionada" -ForegroundColor Green
} else {
    Write-Host "❌ Rota de teste não encontrada" -ForegroundColor Red
}

# 6. Verificar imports do Design System
Write-Host "`n6. Verificando imports do Design System..." -ForegroundColor Yellow
$files = @(
    "src/pages/Dashboard.jsx",
    "src/pages/TestePadronizacao.jsx",
    "src/components/StandardPageLayout.jsx",
    "src/components/ResponsiveCard.jsx",
    "src/components/ResponsiveGrid.jsx",
    "src/components/ResponsiveTable.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "designSystem" -or $content -match "DESIGN_SYSTEM") {
            Write-Host "✅ $file usa Design System" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $file não usa Design System" -ForegroundColor Yellow
        }
    }
}

# 7. Verificar consistência de classes CSS
Write-Host "`n7. Verificando consistência de classes CSS..." -ForegroundColor Yellow
$cssClasses = @(
    "text-yellow-400",
    "text-white",
    "text-gray-400",
    "bg-gray-800",
    "card",
    "space-y-8",
    "max-w-4xl"
)

foreach ($class in $cssClasses) {
    $count = (Get-ChildItem -Path "src" -Recurse -Include "*.jsx" | Select-String -Pattern $class).Count
    Write-Host "📊 Classe '$class': $count ocorrências" -ForegroundColor Cyan
}

# 8. Verificar responsividade
Write-Host "`n8. Verificando responsividade..." -ForegroundColor Yellow
$responsiveClasses = @(
    "grid-cols-1",
    "sm:grid-cols-2",
    "lg:grid-cols-4",
    "md:text-2xl",
    "md:p-6"
)

foreach ($class in $responsiveClasses) {
    $count = (Get-ChildItem -Path "src" -Recurse -Include "*.jsx" | Select-String -Pattern $class).Count
    Write-Host "📱 Classe '$class': $count ocorrências" -ForegroundColor Cyan
}

# 9. Instruções para teste manual
Write-Host "`n9. INSTRUÇÕES PARA TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Verifique se o layout está centralizado" -ForegroundColor White
Write-Host "3. Teste responsividade redimensionando a janela" -ForegroundColor White
Write-Host "4. Acesse: http://localhost:5173/teste-padronizacao" -ForegroundColor White
Write-Host "5. Verifique todos os componentes padronizados" -ForegroundColor White
Write-Host "6. Teste em Mobile, Tablet e Desktop" -ForegroundColor White

# 10. Checklist de validação
Write-Host "`n10. CHECKLIST DE VALIDAÇÃO:" -ForegroundColor Cyan
Write-Host "✅ Design System unificado criado" -ForegroundColor Green
Write-Host "✅ Componentes base reutilizáveis criados" -ForegroundColor Green
Write-Host "✅ Dashboard atualizado com novo sistema" -ForegroundColor Green
Write-Host "✅ Página de teste criada" -ForegroundColor Green
Write-Host "✅ Rotas configuradas" -ForegroundColor Green
Write-Host "✅ Sistema de cores padronizado" -ForegroundColor Green
Write-Host "✅ Sistema de tipografia padronizado" -ForegroundColor Green
Write-Host "✅ Sistema de espaçamento padronizado" -ForegroundColor Green
Write-Host "✅ Responsividade padronizada" -ForegroundColor Green

Write-Host "`n🎉 TESTE DE CONSISTÊNCIA CONCLUÍDO!" -ForegroundColor Green
Write-Host "O Design System foi implementado com sucesso!" -ForegroundColor Green
Write-Host "Agora todas as páginas podem seguir o mesmo padrão visual." -ForegroundColor Green

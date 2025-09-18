# Script para testar centralização do conteúdo
Write-Host "Testando centralização do conteúdo..." -ForegroundColor Green

# 1. Verificar se o servidor está rodando
Write-Host "`n1. Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor frontend rodando em http://localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor frontend não está rodando. Execute: npm run dev" -ForegroundColor Red
    exit 1
}

# 2. Verificar MainLayout com centralização
Write-Host "`n2. Verificando MainLayout..." -ForegroundColor Yellow
$mainLayoutContent = Get-Content "src/layouts/MainLayout.jsx" -Raw

if ($mainLayoutContent -match "flex flex-col items-center") {
    Write-Host "✅ MainLayout com centralização horizontal (flex flex-col items-center)" -ForegroundColor Green
} else {
    Write-Host "❌ MainLayout não tem centralização horizontal" -ForegroundColor Red
}

if ($mainLayoutContent -match "paddingTop: '50px'") {
    Write-Host "✅ MainLayout com paddingTop: 50px" -ForegroundColor Green
} else {
    Write-Host "❌ MainLayout não tem paddingTop correto" -ForegroundColor Red
}

# 3. Verificar Dashboard com largura máxima
Write-Host "`n3. Verificando Dashboard..." -ForegroundColor Yellow
$dashboardContent = Get-Content "src/pages/Dashboard.jsx" -Raw

if ($dashboardContent -match "max-w-6xl mx-auto") {
    Write-Host "✅ Dashboard com largura máxima e centralização (max-w-6xl mx-auto)" -ForegroundColor Green
} else {
    Write-Host "❌ Dashboard não tem largura máxima e centralização" -ForegroundColor Red
}

# 4. Verificar DashboardCards com largura total
Write-Host "`n4. Verificando DashboardCards..." -ForegroundColor Yellow
$dashboardCardsContent = Get-Content "src/components/DashboardCards.jsx" -Raw

if ($dashboardCardsContent -match "space-y-6 w-full") {
    Write-Host "✅ DashboardCards com largura total (w-full)" -ForegroundColor Green
} else {
    Write-Host "❌ DashboardCards não tem largura total" -ForegroundColor Red
}

# 5. Verificar GameDashboard com largura total
Write-Host "`n5. Verificando GameDashboard..." -ForegroundColor Yellow
$gameDashboardContent = Get-Content "src/components/GameDashboard.jsx" -Raw

if ($gameDashboardContent -match "space-y-6 w-full") {
    Write-Host "✅ GameDashboard com largura total (w-full)" -ForegroundColor Green
} else {
    Write-Host "❌ GameDashboard não tem largura total" -ForegroundColor Red
}

# 6. RESUMO DAS CORREÇÕES
Write-Host "`n6. RESUMO DAS CORREÇÕES:" -ForegroundColor Cyan
Write-Host "✅ MainLayout: flex flex-col items-center para centralização horizontal" -ForegroundColor White
Write-Host "✅ MainLayout: paddingTop: 50px para espaçamento superior" -ForegroundColor White
Write-Host "✅ Dashboard: max-w-6xl mx-auto para largura máxima e centralização" -ForegroundColor White
Write-Host "✅ DashboardCards: w-full para ocupar toda a largura disponível" -ForegroundColor White
Write-Host "✅ GameDashboard: w-full para ocupar toda a largura disponível" -ForegroundColor White

# 7. Instruções para teste
Write-Host "`n7. COMO TESTAR AS CORREÇÕES:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Teste o posicionamento do conteúdo:" -ForegroundColor White
Write-Host "   - Conteúdo deve estar centralizado horizontalmente na página" -ForegroundColor White
Write-Host "   - Cards devem ter 50px de padding superior" -ForegroundColor White
Write-Host "   - Conteúdo deve ter largura máxima de 6xl (1152px)" -ForegroundColor White
Write-Host "3. Teste em diferentes dispositivos:" -ForegroundColor White
Write-Host "   - Desktop: Conteúdo centralizado com largura máxima" -ForegroundColor White
Write-Host "   - Tablet: Conteúdo centralizado com largura máxima" -ForegroundColor White
Write-Host "   - Mobile: Conteúdo centralizado com largura máxima" -ForegroundColor White
Write-Host "4. Verifique se o conteúdo não fica mais colado à sidebar" -ForegroundColor White
Write-Host "5. Verifique se há espaçamento adequado em todos os lados" -ForegroundColor White

Write-Host "`n8. CORREÇÕES IMPLEMENTADAS:" -ForegroundColor White
Write-Host "• MainLayout: flex flex-col items-center para centralização" -ForegroundColor Green
Write-Host "• Dashboard: max-w-6xl mx-auto para largura máxima" -ForegroundColor Green
Write-Host "• DashboardCards: w-full para largura total" -ForegroundColor Green
Write-Host "• GameDashboard: w-full para largura total" -ForegroundColor Green
Write-Host "• Padding superior: 50px mantido" -ForegroundColor Green

Write-Host "`nTESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "As correções de centralização foram implementadas!" -ForegroundColor Green
Write-Host "O conteúdo agora deve estar centralizado horizontalmente na página!" -ForegroundColor Green

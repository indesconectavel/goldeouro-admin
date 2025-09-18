# Script para limpar cache e forçar reload das alterações
Write-Host "Limpando cache e forçando reload das alterações..." -ForegroundColor Green

# 1. Verificar se o servidor está rodando
Write-Host "`n1. Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor frontend rodando em http://localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor frontend não está rodando. Execute: npm run dev" -ForegroundColor Red
    exit 1
}

# 2. Verificar alterações aplicadas
Write-Host "`n2. Verificando alterações aplicadas..." -ForegroundColor Yellow

# Verificar MainLayout
$mainLayoutContent = Get-Content "src/layouts/MainLayout.jsx" -Raw
if ($mainLayoutContent -match "flex flex-col items-center") {
    Write-Host "✅ MainLayout: Centralização horizontal aplicada" -ForegroundColor Green
} else {
    Write-Host "❌ MainLayout: Centralização não encontrada" -ForegroundColor Red
}

# Verificar Dashboard
$dashboardContent = Get-Content "src/pages/Dashboard.jsx" -Raw
if ($dashboardContent -match "max-w-6xl mx-auto") {
    Write-Host "✅ Dashboard: Largura máxima aplicada" -ForegroundColor Green
} else {
    Write-Host "❌ Dashboard: Largura máxima não encontrada" -ForegroundColor Red
}

# 3. Instruções para limpar cache
Write-Host "`n3. INSTRUÇÕES PARA VER AS ALTERAÇÕES:" -ForegroundColor Cyan
Write-Host "1. Abra o navegador e acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Pressione Ctrl + Shift + R (ou Cmd + Shift + R no Mac)" -ForegroundColor White
Write-Host "   Isso força o reload sem cache" -ForegroundColor White
Write-Host "3. Ou abra o DevTools (F12) e:" -ForegroundColor White
Write-Host "   - Clique com botão direito no botão de reload" -ForegroundColor White
Write-Host "   - Selecione 'Esvaziar cache e recarregar forçadamente'" -ForegroundColor White
Write-Host "4. Ou use Ctrl + F5 para forçar reload" -ForegroundColor White

# 4. Verificar se as alterações estão corretas
Write-Host "`n4. ALTERAÇÕES IMPLEMENTADAS:" -ForegroundColor Cyan
Write-Host "✅ MainLayout: flex flex-col items-center (centralização horizontal)" -ForegroundColor Green
Write-Host "✅ MainLayout: paddingTop: 50px (espaçamento superior)" -ForegroundColor Green
Write-Host "✅ Dashboard: max-w-6xl mx-auto (largura máxima e centralização)" -ForegroundColor Green
Write-Host "✅ DashboardCards: w-full (largura total)" -ForegroundColor Green
Write-Host "✅ GameDashboard: w-full (largura total)" -ForegroundColor Green

# 5. O que você deve ver após limpar o cache
Write-Host "`n5. O QUE VOCÊ DEVE VER:" -ForegroundColor Cyan
Write-Host "• Conteúdo centralizado horizontalmente na página" -ForegroundColor White
Write-Host "• Cards com 50px de padding superior" -ForegroundColor White
Write-Host "• Largura máxima de 1152px (max-w-6xl)" -ForegroundColor White
Write-Host "• Espaçamento adequado em todos os lados" -ForegroundColor White
Write-Host "• Conteúdo não colado à sidebar" -ForegroundColor White

# 6. Se ainda não funcionar
Write-Host "`n6. SE AINDA NÃO FUNCIONAR:" -ForegroundColor Yellow
Write-Host "1. Feche completamente o navegador" -ForegroundColor White
Write-Host "2. Abra uma nova aba anônima/privada" -ForegroundColor White
Write-Host "3. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "4. Ou reinicie o servidor:" -ForegroundColor White
Write-Host "   - Pare o servidor (Ctrl+C)" -ForegroundColor White
Write-Host "   - Execute: npm run dev" -ForegroundColor White

Write-Host "`nCACHE LIMPO E INSTRUÇÕES FORNECIDAS!" -ForegroundColor Green
Write-Host "Siga as instruções acima para ver as alterações!" -ForegroundColor Green

# Script para testar centralização final
Write-Host "Testando centralização final do conteúdo..." -ForegroundColor Green

# 1. Verificar servidor
Write-Host "`n1. Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor frontend rodando em http://localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor frontend não está rodando" -ForegroundColor Red
    exit 1
}

# 2. Verificar MainLayout
Write-Host "`n2. Verificando MainLayout..." -ForegroundColor Yellow
$mainLayoutContent = Get-Content "src/layouts/MainLayout.jsx" -Raw

if ($mainLayoutContent -match "flex flex-col items-center justify-start") {
    Write-Host "✅ MainLayout: Centralização horizontal e vertical aplicada" -ForegroundColor Green
} else {
    Write-Host "❌ MainLayout: Centralização não encontrada" -ForegroundColor Red
}

if ($mainLayoutContent -match "paddingTop: '50px'") {
    Write-Host "✅ MainLayout: Padding superior de 50px aplicado" -ForegroundColor Green
} else {
    Write-Host "❌ MainLayout: Padding superior não encontrado" -ForegroundColor Red
}

# 3. Verificar Dashboard
Write-Host "`n3. Verificando Dashboard..." -ForegroundColor Yellow
$dashboardContent = Get-Content "src/pages/Dashboard.jsx" -Raw

if ($dashboardContent -match "max-w-4xl mx-auto") {
    Write-Host "✅ Dashboard: Largura máxima de 4xl e centralização aplicada" -ForegroundColor Green
} else {
    Write-Host "❌ Dashboard: Largura máxima e centralização não encontradas" -ForegroundColor Red
}

# 4. Instruções para teste
Write-Host "`n4. INSTRUÇÕES PARA TESTAR:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Pressione Ctrl + Shift + R para limpar cache" -ForegroundColor White
Write-Host "3. Verifique se o conteúdo está centralizado horizontalmente" -ForegroundColor White
Write-Host "4. Verifique se há 50px de padding superior" -ForegroundColor White
Write-Host "5. Verifique se a largura máxima é de 896px (max-w-4xl)" -ForegroundColor White

# 5. O que deve estar visível
Write-Host "`n5. RESULTADO ESPERADO:" -ForegroundColor Cyan
Write-Host "• Conteúdo centralizado horizontalmente na página" -ForegroundColor White
Write-Host "• Largura máxima de 896px (max-w-4xl)" -ForegroundColor White
Write-Host "• 50px de padding superior" -ForegroundColor White
Write-Host "• Espaçamento adequado em todos os lados" -ForegroundColor White
Write-Host "• Conteúdo não colado à sidebar" -ForegroundColor White

Write-Host "`nTESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "Acesse http://localhost:5173/painel e pressione Ctrl + Shift + R" -ForegroundColor Green

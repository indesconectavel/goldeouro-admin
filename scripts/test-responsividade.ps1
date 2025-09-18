# Script de Teste de Responsividade
# Testa a implementação responsiva com diferentes dispositivos

Write-Host "🧪 Iniciando testes de responsividade..." -ForegroundColor Green

# 1. Verificar se o servidor está rodando
Write-Host "🔍 Verificando se o servidor está rodando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor está rodando em http://localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor não está rodando. Execute: npm run dev" -ForegroundColor Red
    exit 1
}

# 2. Criar diretório de screenshots
$screenshotDir = "screenshots-responsividade-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $screenshotDir -Force | Out-Null
Write-Host "📸 Screenshots serão salvos em: $screenshotDir" -ForegroundColor Yellow

# 3. Instruções para teste manual
Write-Host "`n📱 INSTRUÇÕES PARA TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Abra o Chrome DevTools (F12)" -ForegroundColor White
Write-Host "2. Ative o Device Mode (Ctrl+Shift+M)" -ForegroundColor White
Write-Host "3. Teste os seguintes dispositivos:" -ForegroundColor White
Write-Host "   📱 Mobile: iPhone 12 Pro (390x844)" -ForegroundColor White
Write-Host "   📱 Mobile: Samsung Galaxy S20 (360x800)" -ForegroundColor White
Write-Host "   📱 Tablet: iPad (768x1024)" -ForegroundColor White
Write-Host "   📱 Tablet: iPad Pro (1024x1366)" -ForegroundColor White
Write-Host "   🖥️ Desktop: Desktop (1920x1080)" -ForegroundColor White

Write-Host "`n🔍 VALIDAÇÕES NECESSÁRIAS:" -ForegroundColor Cyan
Write-Host "✅ Mobile (0-639px):" -ForegroundColor Green
Write-Host "   - Sidebar inicia oculta" -ForegroundColor White
Write-Host "   - Botão toggle visível" -ForegroundColor White
Write-Host "   - Logo pequeno (64px)" -ForegroundColor White
Write-Host "   - Sidebar abre/fecha suavemente" -ForegroundColor White

Write-Host "✅ Tablet (640-1023px):" -ForegroundColor Green
Write-Host "   - Sidebar inicia oculta" -ForegroundColor White
Write-Host "   - Botão toggle visível" -ForegroundColor White
Write-Host "   - Logo médio (96px)" -ForegroundColor White
Write-Host "   - Sidebar abre/fecha suavemente" -ForegroundColor White

Write-Host "✅ Desktop (1024px+):" -ForegroundColor Green
Write-Host "   - Sidebar sempre visível" -ForegroundColor White
Write-Host "   - Sem botão toggle" -ForegroundColor White
Write-Host "   - Logo grande (192px)" -ForegroundColor White
Write-Host "   - Layout original mantido" -ForegroundColor White

Write-Host "`n🚀 FEATURE FLAGS:" -ForegroundColor Cyan
Write-Host "Para habilitar features manualmente, abra o Console (F12) e execute:" -ForegroundColor White
Write-Host "localStorage.setItem('responsive_sidebar', 'true')" -ForegroundColor Yellow
Write-Host "localStorage.setItem('responsive_cards', 'true')" -ForegroundColor Yellow
Write-Host "localStorage.setItem('responsive_logo', 'true')" -ForegroundColor Yellow

Write-Host "`n🔄 ROLLBACK:" -ForegroundColor Cyan
Write-Host "Se algo der errado, execute o rollback:" -ForegroundColor White
Write-Host ".\backup-responsividade-*\rollback.ps1" -ForegroundColor Yellow

Write-Host "`n✅ Teste concluído! Verifique os resultados acima." -ForegroundColor Green

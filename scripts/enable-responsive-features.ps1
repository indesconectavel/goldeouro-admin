# Script para habilitar features responsivas para teste
Write-Host "🚀 Habilitando features responsivas..." -ForegroundColor Green

# Criar arquivo de configuração para habilitar features
$configContent = @"
// Configuração para habilitar features responsivas
// Este arquivo é carregado automaticamente pelo sistema

// Habilitar todas as features responsivas
localStorage.setItem('responsive_sidebar', 'true');
localStorage.setItem('responsive_cards', 'true');
localStorage.setItem('responsive_logo', 'true');

console.log('✅ Features responsivas habilitadas!');
console.log('📱 Mobile: Sidebar responsiva, cards adaptativos');
console.log('📱 Tablet: Sidebar responsiva, cards adaptativos');
console.log('🖥️ Desktop: Layout original mantido');
"@

$configContent | Out-File -FilePath "src/config/enableResponsive.js" -Encoding UTF8

Write-Host "✅ Features responsivas habilitadas!" -ForegroundColor Green
Write-Host "🔄 Reinicie o servidor para aplicar as mudanças" -ForegroundColor Yellow
Write-Host "Teste com Responsive Viewer no Chrome" -ForegroundColor Cyan

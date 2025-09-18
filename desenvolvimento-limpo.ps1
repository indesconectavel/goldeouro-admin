# Script para desenvolvimento limpo - SEM SEGURANÇA
Write-Host "🧹 Iniciando desenvolvimento limpo..." -ForegroundColor Yellow

# Parar processos Node.js
Write-Host "🛑 Parando processos Node.js..." -ForegroundColor Red
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Limpar cache
Write-Host "🗑️ Limpando cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue

# Limpar cache do navegador (se possível)
Write-Host "🌐 Limpando cache do navegador..." -ForegroundColor Yellow
Start-Process "chrome.exe" -ArgumentList "--disable-web-security", "--disable-features=VizDisplayCompositor", "--user-data-dir=C:\temp\chrome-dev" -ErrorAction SilentlyContinue

# Iniciar servidor de desenvolvimento
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "📱 Acesse: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Modo: DESENVOLVIMENTO SEM SEGURANÇA" -ForegroundColor Red

npm run dev



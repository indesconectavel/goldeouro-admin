# Script para desenvolvimento COMPLETAMENTE LIMPO
Write-Host "🚀 Iniciando desenvolvimento LIMPO - SEM CSP" -ForegroundColor Green

# Parar todos os processos Node.js
Write-Host "🛑 Parando processos Node.js..." -ForegroundColor Red
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Limpar TUDO
Write-Host "🧹 Limpando cache e arquivos temporários..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".vite" -ErrorAction SilentlyContinue

# Iniciar backend primeiro
Write-Host "🔧 Iniciando backend..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory ".." -WindowStyle Minimized

# Aguardar backend iniciar
Write-Host "⏳ Aguardando backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "🎨 Iniciando frontend..." -ForegroundColor Green
Write-Host "📱 Acesse: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Modo: DESENVOLVIMENTO SEM CSP" -ForegroundColor Red
Write-Host "⚠️  Use modo incógnito para evitar extensões" -ForegroundColor Yellow

npm run dev



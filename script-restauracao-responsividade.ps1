# ========================================
# SCRIPT DE RESTAURAÇÃO - PAINEL ADMIN
# GOL DE OURO - CORREÇÕES DE RESPONSIVIDADE
# ========================================
# Data: 2025-01-07
# Versão: 1.0
# Descrição: Restaura o painel admin para o estado antes das correções de responsividade

Write-Host "🔄 INICIANDO RESTAURAÇÃO DO PAINEL ADMIN..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Yellow

# Verificar se o backup existe
$backupDir = "backup-admin-panel-responsividade-2025-01-07_15-30-00"
if (-not (Test-Path $backupDir)) {
    Write-Host "❌ ERRO: Diretório de backup não encontrado: $backupDir" -ForegroundColor Red
    Write-Host "Verifique se o backup foi criado corretamente." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backup encontrado: $backupDir" -ForegroundColor Green

# 1. Fazer backup do estado atual (caso algo dê errado)
$currentBackup = "backup-antes-restauracao-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
Write-Host "📁 Criando backup do estado atual: $currentBackup" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $currentBackup -Force | Out-Null

# Backup do estado atual
if (Test-Path "src") { Copy-Item -Path "src" -Destination "$currentBackup\src" -Recurse -Force }
if (Test-Path "index.html") { Copy-Item -Path "index.html" -Destination "$currentBackup\index.html" -Force }
if (Test-Path "package.json") { Copy-Item -Path "package.json" -Destination "$currentBackup\package.json" -Force }
if (Test-Path "vite.config.js") { Copy-Item -Path "vite.config.js" -Destination "$currentBackup\vite.config.js" -Force }
if (Test-Path "tailwind.config.js") { Copy-Item -Path "tailwind.config.js" -Destination "$currentBackup\tailwind.config.js" -Force }
if (Test-Path "vercel.json") { Copy-Item -Path "vercel.json" -Destination "$currentBackup\vercel.json" -Force }

Write-Host "✅ Backup do estado atual criado" -ForegroundColor Green

# 2. Restaurar arquivos do backup
Write-Host "🔄 Restaurando arquivos do backup..." -ForegroundColor Yellow

# Remover diretórios atuais
if (Test-Path "src") { Remove-Item -Path "src" -Recurse -Force }
if (Test-Path "index.html") { Remove-Item -Path "index.html" -Force }
if (Test-Path "package.json") { Remove-Item -Path "package.json" -Force }
if (Test-Path "vite.config.js") { Remove-Item -Path "vite.config.js" -Force }
if (Test-Path "tailwind.config.js") { Remove-Item -Path "tailwind.config.js" -Force }
if (Test-Path "vercel.json") { Remove-Item -Path "vercel.json" -Force }

# Restaurar do backup
Copy-Item -Path "$backupDir\src" -Destination "src" -Recurse -Force
Copy-Item -Path "$backupDir\index.html" -Destination "index.html" -Force
Copy-Item -Path "$backupDir\package.json" -Destination "package.json" -Force
Copy-Item -Path "$backupDir\vite.config.js" -Destination "vite.config.js" -Force
Copy-Item -Path "$backupDir\tailwind.config.js" -Destination "tailwind.config.js" -Force
Copy-Item -Path "$backupDir\vercel.json" -Destination "vercel.json" -Force

Write-Host "✅ Arquivos restaurados com sucesso!" -ForegroundColor Green

# 3. Verificar integridade
Write-Host "🔍 Verificando integridade dos arquivos..." -ForegroundColor Yellow

$files = @("src", "index.html", "package.json", "vite.config.js", "tailwind.config.js", "vercel.json")
$allOk = $true

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file - OK" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - FALTANDO" -ForegroundColor Red
        $allOk = $false
    }
}

if ($allOk) {
    Write-Host "🎉 RESTAURAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Yellow
    Write-Host "O painel admin foi restaurado para o estado anterior às correções de responsividade." -ForegroundColor White
    Write-Host "Backup do estado atual salvo em: $currentBackup" -ForegroundColor Cyan
} else {
    Write-Host "❌ ERRO NA RESTAURAÇÃO!" -ForegroundColor Red
    Write-Host "Alguns arquivos não foram restaurados corretamente." -ForegroundColor Red
    Write-Host "Verifique os erros acima e tente novamente." -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Verificar se o painel está funcionando: npm run dev" -ForegroundColor White
Write-Host "2. Testar todas as funcionalidades" -ForegroundColor White
Write-Host "3. Se necessário, aplicar correções novamente" -ForegroundColor White

Write-Host "`n🔒 SEGURANÇA:" -ForegroundColor Cyan
Write-Host "- Backup original: $backupDir" -ForegroundColor White
Write-Host "- Backup atual: $currentBackup" -ForegroundColor White
Write-Host "- Ambos os backups estão seguros e podem ser restaurados" -ForegroundColor White




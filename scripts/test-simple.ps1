# TESTE SIMPLES DO SISTEMA DE BACKUP
Write-Host "Testando sistema de backup..." -ForegroundColor Cyan

# Verificar se estamos no diretório correto
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$PackageJsonPath = Join-Path $ProjectRoot "package.json"

if (Test-Path $PackageJsonPath) {
    Write-Host "✅ Projeto encontrado: $ProjectRoot" -ForegroundColor Green
} else {
    Write-Host "❌ Projeto não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar scripts
$Scripts = @("backup.ps1", "quick-restore.ps1", "backup-manager.bat")
foreach ($script in $Scripts) {
    $scriptPath = Join-Path $PSScriptRoot $script
    if (Test-Path $scriptPath) {
        Write-Host "✅ $script" -ForegroundColor Green
    } else {
        Write-Host "❌ $script" -ForegroundColor Red
    }
}

# Verificar diretório de backups
$BackupDir = Join-Path $ProjectRoot "backups"
if (Test-Path $BackupDir) {
    Write-Host "✅ Diretório de backups existe" -ForegroundColor Green
} else {
    try {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        Write-Host "✅ Diretório de backups criado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao criar diretório de backups" -ForegroundColor Red
    }
}

# Testar backup rápido
Write-Host "`nTestando backup rápido..." -ForegroundColor Yellow
try {
    & "$PSScriptRoot\backup.ps1" quick
    Write-Host "✅ Backup rápido funcionou" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no backup rápido: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Teste concluído!" -ForegroundColor Green

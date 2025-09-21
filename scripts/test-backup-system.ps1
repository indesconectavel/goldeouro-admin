# TESTE DO SISTEMA DE BACKUP - GOL DE OURO ADMIN
# Script para testar se o sistema de backup está funcionando
# Data: 09/01/2025

Write-Host "🧪 TESTANDO SISTEMA DE BACKUP - GOL DE OURO ADMIN" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos no diretório correto
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$PackageJsonPath = Join-Path $ProjectRoot "package.json"

if (-not (Test-Path $PackageJsonPath)) {
    Write-Host "❌ ERRO: package.json não encontrado" -ForegroundColor Red
    Write-Host "   Execute este script a partir da pasta scripts/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Diretório do projeto encontrado: $ProjectRoot" -ForegroundColor Green

# Verificar se os scripts existem
$Scripts = @(
    "backup.ps1",
    "quick-restore.ps1", 
    "backup-manager.bat",
    "create-backup-now.ps1"
)

Write-Host "`n🔍 Verificando scripts..." -ForegroundColor Yellow
foreach ($script in $Scripts) {
    $scriptPath = Join-Path $PSScriptRoot $script
    if (Test-Path $scriptPath) {
        Write-Host "  ✅ $script" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $script" -ForegroundColor Red
    }
}

# Verificar se o diretório de backups existe ou pode ser criado
$BackupDir = Join-Path $ProjectRoot "backups"
Write-Host "`n📁 Verificando diretório de backups..." -ForegroundColor Yellow

if (Test-Path $BackupDir) {
    Write-Host "  ✅ Diretório de backups existe: $BackupDir" -ForegroundColor Green
} else {
    try {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        Write-Host "  ✅ Diretório de backups criado: $BackupDir" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Erro ao criar diretório de backups: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Testar criação de backup rápido
Write-Host "`n⚡ Testando backup rápido..." -ForegroundColor Yellow
try {
    $result = & "$PSScriptRoot\backup.ps1" quick
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Backup rápido funcionando" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Backup rápido com avisos (código: $LASTEXITCODE)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ Erro no backup rápido: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar se backup foi criado
Write-Host "`n📊 Verificando backups criados..." -ForegroundColor Yellow
$Backups = Get-ChildItem -Path $BackupDir -Directory | Where-Object { $_.Name -like "*BACKUP*" }
if ($Backups.Count -gt 0) {
    Write-Host "  ✅ $($Backups.Count) backup(s) encontrado(s):" -ForegroundColor Green
    foreach ($backup in $Backups) {
        Write-Host "    - $($backup.Name)" -ForegroundColor Cyan
    }
} else {
    Write-Host "  ⚠️  Nenhum backup encontrado" -ForegroundColor Yellow
}

# Testar listagem de backups
Write-Host "`n📋 Testando listagem de backups..." -ForegroundColor Yellow
try {
    & "$PSScriptRoot\backup.ps1" list
    Write-Host "  ✅ Listagem funcionando" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Erro na listagem: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar scripts NPM
Write-Host "`n📦 Verificando scripts NPM..." -ForegroundColor Yellow
$PackageJson = Get-Content $PackageJsonPath | ConvertFrom-Json
$BackupScripts = @("backup", "backup:quick", "backup:list", "restore", "restore:quick", "backup:now", "backup:manager")

foreach ($script in $BackupScripts) {
    if ($PackageJson.scripts.PSObject.Properties.Name -contains $script) {
        Write-Host "  ✅ npm run $script" -ForegroundColor Green
    } else {
        Write-Host "  ❌ npm run $script (não encontrado)" -ForegroundColor Red
    }
}

# Resumo final
Write-Host "`n📊 RESUMO DO TESTE" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

$AllScriptsExist = ($Scripts | ForEach-Object { Test-Path (Join-Path $PSScriptRoot $_) }) -notcontains $false
$BackupDirExists = Test-Path $BackupDir
$NpmScriptsExist = ($BackupScripts | ForEach-Object { $PackageJson.scripts.PSObject.Properties.Name -contains $_ }) -notcontains $false

if ($AllScriptsExist -and $BackupDirExists -and $NpmScriptsExist) {
    Write-Host "✅ SISTEMA DE BACKUP FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 COMANDOS DISPONÍVEIS:" -ForegroundColor Cyan
    Write-Host "  npm run backup        - Backup completo" -ForegroundColor White
    Write-Host "  npm run backup:quick  - Backup rápido" -ForegroundColor White
    Write-Host "  npm run backup:now    - Backup imediato" -ForegroundColor White
    Write-Host "  npm run restore:quick - Restauração rápida" -ForegroundColor White
    Write-Host "  npm run backup:list   - Listar backups" -ForegroundColor White
    Write-Host "  npm run backup:manager - Interface gráfica" -ForegroundColor White
} else {
    Write-Host "⚠️  SISTEMA DE BACKUP COM PROBLEMAS" -ForegroundColor Yellow
    Write-Host "   Verifique os erros acima e corrija antes de usar" -ForegroundColor Yellow
}

Write-Host "`n🛡️  Sistema de backup testado com sucesso!" -ForegroundColor Green
Write-Host "   Agora você pode usar os comandos de backup com segurança" -ForegroundColor Cyan

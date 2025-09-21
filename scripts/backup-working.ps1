# SISTEMA DE BACKUP FUNCIONAL - GOL DE OURO ADMIN
param(
    [string]$Action = "help",
    [string]$BackupName = ""
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDir = Join-Path $ProjectRoot "backups"
$Timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"

if ($Action -eq "help") {
    Write-Host "SISTEMA DE BACKUP - GOL DE OURO ADMIN" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Comandos disponíveis:" -ForegroundColor Yellow
    Write-Host "  .\backup-working.ps1 create  - Criar backup completo" -ForegroundColor White
    Write-Host "  .\backup-working.ps1 quick   - Criar backup rápido" -ForegroundColor White
    Write-Host "  .\backup-working.ps1 list    - Listar backups" -ForegroundColor White
    Write-Host "  .\backup-working.ps1 restore - Restaurar último backup" -ForegroundColor White
    Write-Host ""
    exit 0
}

# Criar diretório de backups
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    Write-Host "✅ Diretório de backups criado" -ForegroundColor Green
}

if ($Action -eq "create") {
    $BackupName = "BACKUP-$Timestamp"
    $BackupPath = Join-Path $BackupDir $BackupName
    
    Write-Host "🚀 Criando backup completo..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    
    $Files = @("src", "package.json", "package-lock.json", "vite.config.js", "index.html", "tailwind.config.js", "postcss.config.js", "tsconfig.json", "public")
    
    foreach ($file in $Files) {
        $SourcePath = Join-Path $ProjectRoot $file
        $DestPath = Join-Path $BackupPath $file
        
        if (Test-Path $SourcePath) {
            if ((Get-Item $SourcePath).PSIsContainer) {
                Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
            } else {
                Copy-Item -Path $SourcePath -Destination $DestPath -Force
            }
            Write-Host "  ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $file não encontrado" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n✅ Backup completo criado: $BackupName" -ForegroundColor Green
    Write-Host "📁 Local: $BackupPath" -ForegroundColor Cyan
}

if ($Action -eq "quick") {
    $BackupName = "QUICK-BACKUP-$Timestamp"
    $BackupPath = Join-Path $BackupDir $BackupName
    
    Write-Host "⚡ Criando backup rápido..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    
    $Files = @("src", "package.json", "vite.config.js", "index.html")
    
    foreach ($file in $Files) {
        $SourcePath = Join-Path $ProjectRoot $file
        $DestPath = Join-Path $BackupPath $file
        
        if (Test-Path $SourcePath) {
            if ((Get-Item $SourcePath).PSIsContainer) {
                Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
            } else {
                Copy-Item -Path $SourcePath -Destination $DestPath -Force
            }
            Write-Host "  ✅ $file" -ForegroundColor Green
        }
    }
    
    Write-Host "`n✅ Backup rápido criado: $BackupName" -ForegroundColor Green
}

if ($Action -eq "list") {
    Write-Host "`n📁 BACKUPS DISPONÍVEIS:" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    
    if (Test-Path $BackupDir) {
        $Backups = Get-ChildItem -Path $BackupDir -Directory | Sort-Object LastWriteTime -Descending
        $i = 1
        foreach ($backup in $Backups) {
            Write-Host "$i. $($backup.Name)" -ForegroundColor White
            Write-Host "   Data: $($backup.LastWriteTime)" -ForegroundColor Gray
            Write-Host ""
            $i++
        }
    } else {
        Write-Host "Nenhum backup encontrado" -ForegroundColor Yellow
    }
}

if ($Action -eq "restore") {
    if (-not $BackupName) {
        # Encontrar último backup
        if (Test-Path $BackupDir) {
            $LastBackup = Get-ChildItem -Path $BackupDir -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if ($LastBackup) {
                $BackupName = $LastBackup.Name
            } else {
                Write-Host "❌ Nenhum backup encontrado" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "❌ Diretório de backups não existe" -ForegroundColor Red
            exit 1
        }
    }
    
    $BackupPath = Join-Path $BackupDir $BackupName
    
    if (-not (Test-Path $BackupPath)) {
        Write-Host "❌ Backup não encontrado: $BackupName" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "🔄 Restaurando backup: $BackupName" -ForegroundColor Cyan
    
    # Criar backup de segurança
    $CurrentBackup = "BACKUP-ANTES-RESTAURACAO-$Timestamp"
    $CurrentBackupPath = Join-Path $BackupDir $CurrentBackup
    New-Item -ItemType Directory -Path $CurrentBackupPath -Force | Out-Null
    
    Write-Host "📦 Criando backup de segurança..." -ForegroundColor Yellow
    
    $Files = @("src", "package.json", "package-lock.json", "vite.config.js", "index.html")
    foreach ($file in $Files) {
        $SourcePath = Join-Path $ProjectRoot $file
        $DestPath = Join-Path $CurrentBackupPath $file
        
        if (Test-Path $SourcePath) {
            if ((Get-Item $SourcePath).PSIsContainer) {
                Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
            } else {
                Copy-Item -Path $SourcePath -Destination $DestPath -Force
            }
        }
    }
    
    Write-Host "✅ Backup de segurança criado: $CurrentBackup" -ForegroundColor Green
    Write-Host "🔄 Restaurando arquivos..." -ForegroundColor Yellow
    
    foreach ($file in $Files) {
        $SourcePath = Join-Path $BackupPath $file
        $DestPath = Join-Path $ProjectRoot $file
        
        if (Test-Path $SourcePath) {
            # Remover arquivo atual
            if (Test-Path $DestPath) {
                if ((Get-Item $DestPath).PSIsContainer) {
                    Remove-Item -Path $DestPath -Recurse -Force
                } else {
                    Remove-Item -Path $DestPath -Force
                }
            }
            
            # Copiar do backup
            if ((Get-Item $SourcePath).PSIsContainer) {
                Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
            } else {
                Copy-Item -Path $SourcePath -Destination $DestPath -Force
            }
            
            Write-Host "  ✅ $file" -ForegroundColor Green
        }
    }
    
    Write-Host "`n✅ Restauração concluída com sucesso!" -ForegroundColor Green
    Write-Host "📁 Backup restaurado: $BackupName" -ForegroundColor Cyan
    Write-Host "🔄 Execute 'npm install' para reinstalar dependências" -ForegroundColor Yellow
}

Write-Host "`n🛡️  Sistema de backup executado!" -ForegroundColor Green

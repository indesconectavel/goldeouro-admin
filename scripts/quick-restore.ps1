# RESTAURAÇÃO RÁPIDA - GOL DE OURO ADMIN
# Versão: 1.0.0
# Data: 09/01/2025
# 
# Script para restauração rápida do último backup

param(
    [Parameter(Position=0)]
    [string]$BackupName = ""
)

# Configurações
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDir = Join-Path $ProjectRoot "backups"

# Cores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Encontrar o último backup
function Get-LatestBackup {
    if (-not (Test-Path $BackupDir)) {
        Write-ColorOutput "❌ Nenhum backup encontrado" "Red"
        return $null
    }

    $Backups = Get-ChildItem -Path $BackupDir -Directory | 
        Where-Object { $_.Name -like "BACKUP-*" } |
        Sort-Object LastWriteTime -Descending

    if ($Backups.Count -eq 0) {
        Write-ColorOutput "❌ Nenhum backup encontrado" "Red"
        return $null
    }

    return $Backups[0]
}

# Restauração rápida
function Start-QuickRestore {
    param([string]$BackupName)
    
    try {
        # Se não especificado, usar o último backup
        if (-not $BackupName) {
            $LatestBackup = Get-LatestBackup
            if (-not $LatestBackup) {
                return
            }
            $BackupName = $LatestBackup.Name
        }

        $BackupPath = Join-Path $BackupDir $BackupName
        
        if (-not (Test-Path $BackupPath)) {
            Write-ColorOutput "❌ Backup não encontrado: $BackupName" "Red"
            return
        }

        Write-ColorOutput "🚀 RESTAURAÇÃO RÁPIDA - GOL DE OURO ADMIN" "Cyan"
        Write-ColorOutput "=========================================" "Cyan"
        Write-ColorOutput "📁 Backup: $BackupName" "White"
        Write-ColorOutput "🕐 Iniciando restauração..." "Yellow"
        
        # Criar backup de segurança rápido
        $CurrentBackup = "BACKUP-ANTES-RESTAURACAO-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss')"
        $CurrentBackupPath = Join-Path $BackupDir $CurrentBackup
        New-Item -ItemType Directory -Path $CurrentBackupPath -Force | Out-Null
        
        Write-ColorOutput "📦 Criando backup de segurança..." "Yellow"
        
        # Copiar apenas arquivos críticos atuais
        $CriticalFiles = @("src", "package.json", "vite.config.js", "index.html")
        foreach ($file in $CriticalFiles) {
            $SourcePath = Join-Path $ProjectRoot $file
            if (Test-Path $SourcePath) {
                $Item = Get-Item $SourcePath
                if ($Item.PSIsContainer) {
                    Copy-Item -Path $SourcePath -Destination (Join-Path $CurrentBackupPath $file) -Recurse -Force
                } else {
                    Copy-Item -Path $SourcePath -Destination (Join-Path $CurrentBackupPath $file) -Force
                }
            }
        }
        
        Write-ColorOutput "✅ Backup de segurança criado: $CurrentBackup" "Green"
        
        # Restaurar arquivos
        Write-ColorOutput "🔄 Restaurando arquivos..." "Yellow"
        
        # Remover arquivos atuais
        if (Test-Path (Join-Path $ProjectRoot "src")) { 
            Remove-Item -Path (Join-Path $ProjectRoot "src") -Recurse -Force 
        }
        if (Test-Path (Join-Path $ProjectRoot "package.json")) { 
            Remove-Item -Path (Join-Path $ProjectRoot "package.json") -Force 
        }
        if (Test-Path (Join-Path $ProjectRoot "package-lock.json")) { 
            Remove-Item -Path (Join-Path $ProjectRoot "package-lock.json") -Force 
        }
        if (Test-Path (Join-Path $ProjectRoot "vite.config.js")) { 
            Remove-Item -Path (Join-Path $ProjectRoot "vite.config.js") -Force 
        }
        if (Test-Path (Join-Path $ProjectRoot "index.html")) { 
            Remove-Item -Path (Join-Path $ProjectRoot "index.html") -Force 
        }
        
        # Copiar do backup
        Copy-Item -Path (Join-Path $BackupPath "src") -Destination $ProjectRoot -Recurse -Force
        Copy-Item -Path (Join-Path $BackupPath "package.json") -Destination $ProjectRoot -Force
        Copy-Item -Path (Join-Path $BackupPath "package-lock.json") -Destination $ProjectRoot -Force
        Copy-Item -Path (Join-Path $BackupPath "vite.config.js") -Destination $ProjectRoot -Force
        Copy-Item -Path (Join-Path $BackupPath "index.html") -Destination $ProjectRoot -Force
        
        # Copiar outros arquivos importantes se existirem
        $OtherFiles = @("tailwind.config.js", "postcss.config.js", "tsconfig.json", "public")
        foreach ($file in $OtherFiles) {
            $SourcePath = Join-Path $BackupPath $file
            if (Test-Path $SourcePath) {
                $DestPath = Join-Path $ProjectRoot $file
                if (Test-Path $DestPath) {
                    $Item = Get-Item $DestPath
                    if ($Item.PSIsContainer) {
                        Remove-Item -Path $DestPath -Recurse -Force
                    } else {
                        Remove-Item -Path $DestPath -Force
                    }
                }
                
                $Item = Get-Item $SourcePath
                if ($Item.PSIsContainer) {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
                } else {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Force
                }
            }
        }
        
        Write-ColorOutput "`n✅ RESTAURAÇÃO CONCLUÍDA COM SUCESSO!" "Green"
        Write-ColorOutput "=====================================" "Green"
        Write-ColorOutput "📁 Backup restaurado: $BackupName" "Cyan"
        Write-ColorOutput "🛡️  Backup de segurança: $CurrentBackup" "Cyan"
        Write-ColorOutput "" "White"
        Write-ColorOutput "🔄 PRÓXIMOS PASSOS:" "Yellow"
        Write-ColorOutput "1. Execute: npm install" "White"
        Write-ColorOutput "2. Execute: npm run dev" "White"
        Write-ColorOutput "" "White"
        Write-ColorOutput "🚀 Sistema pronto para uso!" "Green"
        
    } catch {
        Write-ColorOutput "`n❌ ERRO NA RESTAURAÇÃO!" "Red"
        Write-ColorOutput "=======================" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
        Write-ColorOutput "" "White"
        Write-ColorOutput "🛡️  Seu backup de segurança foi preservado em:" "Yellow"
        Write-ColorOutput "   $CurrentBackupPath" "Cyan"
    }
}

# Executar restauração
Start-QuickRestore -BackupName $BackupName

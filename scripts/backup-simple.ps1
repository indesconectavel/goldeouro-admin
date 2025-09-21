# SISTEMA DE BACKUP SIMPLES - GOL DE OURO ADMIN
param(
    [Parameter(Position=0)]
    [ValidateSet("create", "list", "restore", "quick", "help")]
    [string]$Action = "help",
    
    [Parameter(Position=1)]
    [string]$BackupName = ""
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDir = Join-Path $ProjectRoot "backups"
$Timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
$BackupName = if ($BackupName) { $BackupName } else { "BACKUP-$Timestamp" }
$BackupPath = Join-Path $BackupDir $BackupName

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Ensure-BackupDir {
    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        Write-ColorOutput "✅ Diretório de backups criado" "Green"
    }
}

function Get-ImportantFiles {
    return @("src", "package.json", "package-lock.json", "vite.config.js", "index.html", "tailwind.config.js", "postcss.config.js", "tsconfig.json", "public")
}

function New-Backup {
    try {
        Write-ColorOutput "🚀 Iniciando backup do sistema..." "Cyan"
        Ensure-BackupDir
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
        
        $ImportantFiles = Get-ImportantFiles
        $BackupInfo = @{
            timestamp = $Timestamp
            backupName = $BackupName
            files = @()
        }
        
        Write-ColorOutput "📁 Copiando arquivos importantes..." "Yellow"
        
        foreach ($file in $ImportantFiles) {
            $SourcePath = Join-Path $ProjectRoot $file
            $DestPath = Join-Path $BackupPath $file
            
            if (Test-Path $SourcePath) {
                $Item = Get-Item $SourcePath
                if ($Item.PSIsContainer) {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
                } else {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Force
                }
                
                $BackupInfo.files += @{
                    path = $file
                    size = $Item.Length
                    modified = $Item.LastWriteTime
                }
                
                Write-ColorOutput "  ✅ $file" "Green"
            } else {
                Write-ColorOutput "  ⚠️  $file não encontrado" "Yellow"
            }
        }
        
        $BackupInfoPath = Join-Path $BackupPath "BACKUP-INFO.json"
        $BackupInfo | ConvertTo-Json -Depth 10 | Set-Content $BackupInfoPath
        
        Write-ColorOutput "`n✅ Backup criado com sucesso!" "Green"
        Write-ColorOutput "📁 Local: $BackupPath" "Cyan"
        Write-ColorOutput "📊 Arquivos: $($BackupInfo.files.Count)" "Cyan"
        
        return @{ success = $true; backupPath = $BackupPath; backupName = $BackupName; files = $BackupInfo.files.Count }
        
    } catch {
        Write-ColorOutput "❌ Erro ao criar backup: $($_.Exception.Message)" "Red"
        return @{ success = $false; error = $_.Exception.Message }
    }
}

function New-QuickBackup {
    try {
        Write-ColorOutput "⚡ Criando backup rápido..." "Cyan"
        Ensure-BackupDir
        
        $QuickBackupName = "QUICK-BACKUP-$Timestamp"
        $QuickBackupPath = Join-Path $BackupDir $QuickBackupName
        New-Item -ItemType Directory -Path $QuickBackupPath -Force | Out-Null
        
        $CriticalFiles = @("src", "package.json", "vite.config.js", "index.html")
        
        foreach ($file in $CriticalFiles) {
            $SourcePath = Join-Path $ProjectRoot $file
            $DestPath = Join-Path $QuickBackupPath $file
            
            if (Test-Path $SourcePath) {
                $Item = Get-Item $SourcePath
                if ($Item.PSIsContainer) {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
                } else {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Force
                }
                Write-ColorOutput "  ✅ $file" "Green"
            }
        }
        
        Write-ColorOutput "`n✅ Backup rápido criado: $QuickBackupName" "Green"
        return @{ success = $true; backupName = $QuickBackupName }
        
    } catch {
        Write-ColorOutput "❌ Erro no backup rápido: $($_.Exception.Message)" "Red"
        return @{ success = $false; error = $_.Exception.Message }
    }
}

function Get-Backups {
    try {
        if (-not (Test-Path $BackupDir)) {
            Write-ColorOutput "📁 Nenhum backup encontrado" "Yellow"
            return @()
        }

        $Backups = Get-ChildItem -Path $BackupDir -Directory | 
            Where-Object { $_.Name -like "BACKUP-*" -or $_.Name -like "QUICK-BACKUP-*" } |
            Sort-Object LastWriteTime -Descending

        return $Backups
    } catch {
        Write-ColorOutput "❌ Erro ao listar backups: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Restore-Backup {
    param([string]$BackupName)
    
    try {
        $BackupPath = Join-Path $BackupDir $BackupName
        
        if (-not (Test-Path $BackupPath)) {
            throw "Backup não encontrado: $BackupName"
        }

        Write-ColorOutput "🔄 Restaurando backup: $BackupName" "Cyan"
        
        $CurrentBackup = "BACKUP-ANTES-RESTAURACAO-$Timestamp"
        $CurrentBackupPath = Join-Path $BackupDir $CurrentBackup
        
        Write-ColorOutput "📦 Criando backup de segurança..." "Yellow"
        New-Item -ItemType Directory -Path $CurrentBackupPath -Force | Out-Null
        
        $ImportantFiles = Get-ImportantFiles
        foreach ($file in $ImportantFiles) {
            $SourcePath = Join-Path $ProjectRoot $file
            $DestPath = Join-Path $CurrentBackupPath $file
            
            if (Test-Path $SourcePath) {
                $Item = Get-Item $SourcePath
                if ($Item.PSIsContainer) {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
                } else {
                    Copy-Item -Path $SourcePath -Destination $DestPath -Force
                }
            }
        }
        
        Write-ColorOutput "✅ Backup de segurança criado: $CurrentBackup" "Green"
        Write-ColorOutput "🔄 Restaurando arquivos..." "Yellow"
        
        foreach ($file in $ImportantFiles) {
            $SourcePath = Join-Path $BackupPath $file
            $DestPath = Join-Path $ProjectRoot $file
            
            if (Test-Path $SourcePath) {
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
                
                Write-ColorOutput "  ✅ $file" "Green"
            }
        }
        
        Write-ColorOutput "`n✅ Restauração concluída com sucesso!" "Green"
        Write-ColorOutput "📁 Backup restaurado: $BackupName" "Cyan"
        Write-ColorOutput "🔄 Execute 'npm install' para reinstalar dependências" "Yellow"
        
        return @{ success = $true; backupName = $BackupName; currentBackup = $CurrentBackup }
        
    } catch {
        Write-ColorOutput "❌ Erro ao restaurar backup: $($_.Exception.Message)" "Red"
        return @{ success = $false; error = $_.Exception.Message }
    }
}

switch ($Action) {
    "create" { New-Backup }
    "quick" { New-QuickBackup }
    "list" {
        $Backups = Get-Backups
        Write-ColorOutput "`n📁 BACKUPS DISPONÍVEIS:" "Cyan"
        Write-ColorOutput "=========================" "Cyan"
        $Backups | ForEach-Object -Begin { $i = 1 } -Process {
            Write-ColorOutput "$i. $($_.Name)" "White"
            Write-ColorOutput "   Data: $($_.LastWriteTime)" "Gray"
            Write-Host ""
            $i++
        }
    }
    "restore" {
        if (-not $BackupName) {
            Write-ColorOutput "❌ Especifique o nome do backup para restaurar" "Red"
            Write-ColorOutput "Uso: .\backup-simple.ps1 restore BACKUP-2025-01-09T10-30-00" "Yellow"
            exit 1
        }
        Restore-Backup -BackupName $BackupName
    }
    "help" {
        Write-ColorOutput @"
🛡️  SISTEMA DE BACKUP - GOL DE OURO ADMIN
==========================================

Comandos disponíveis:
  create    - Criar novo backup completo
  quick     - Criar backup rápido
  list      - Listar backups disponíveis  
  restore   - Restaurar backup específico
  help      - Mostrar esta ajuda

Exemplos:
  .\backup-simple.ps1 create
  .\backup-simple.ps1 quick
  .\backup-simple.ps1 list
  .\backup-simple.ps1 restore BACKUP-2025-01-09T10-30-00
"@ "Cyan"
    }
    default {
        Write-ColorOutput "❌ Ação inválida: $Action" "Red"
        Write-ColorOutput "Use 'help' para ver os comandos disponíveis" "Yellow"
    }
}

# SISTEMA DE BACKUP AUTOMATIZADO - GOL DE OURO ADMIN
# Versão: 1.0.0
# Data: 09/01/2025
# 
# Script PowerShell para backup e restauração rápida

param(
    [Parameter(Position=0)]
    [ValidateSet("create", "list", "restore", "quick", "help")]
    [string]$Action = "help",
    
    [Parameter(Position=1)]
    [string]$BackupName = ""
)

# Configurações
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDir = Join-Path $ProjectRoot "backups"
$Timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
$BackupName = if ($BackupName) { $BackupName } else { "BACKUP-$Timestamp" }
$BackupPath = Join-Path $BackupDir $BackupName

# Cores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Criar diretório de backups
function Ensure-BackupDir {
    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        Write-ColorOutput "✅ Diretório de backups criado" "Green"
    }
}

# Listar arquivos importantes
function Get-ImportantFiles {
    return @(
        "src",
        "package.json",
        "package-lock.json", 
        "vite.config.js",
        "vite.config.dev.js",
        "vite.config.prod.js",
        "tailwind.config.js",
        "postcss.config.js",
        "tsconfig.json",
        "tsconfig.node.json",
        "index.html",
        "public",
        "components.json",
        "manifest.json",
        "sw.js",
        "nginx.conf",
        "Dockerfile",
        ".eslintrc.cjs",
        "jest.config.cjs"
    )
}

# Criar backup completo
function New-Backup {
    try {
        Write-ColorOutput "🚀 Iniciando backup do sistema..." "Cyan"
        
        Ensure-BackupDir
        
        # Criar diretório do backup
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
        
        $ImportantFiles = Get-ImportantFiles
        $BackupInfo = @{
            timestamp = $Timestamp
            backupName = $BackupName
            files = @()
            gitInfo = Get-GitInfo
            systemInfo = Get-SystemInfo
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
        
        # Salvar informações do backup
        $BackupInfoPath = Join-Path $BackupPath "BACKUP-INFO.json"
        $BackupInfo | ConvertTo-Json -Depth 10 | Set-Content $BackupInfoPath
        
        # Criar script de restauração
        New-RestoreScript
        
        # Criar relatório de backup
        New-BackupReport -BackupInfo $BackupInfo
        
        $BackupSize = Get-BackupSize
        Write-ColorOutput "`n✅ Backup criado com sucesso!" "Green"
        Write-ColorOutput "📁 Local: $BackupPath" "Cyan"
        Write-ColorOutput "📊 Arquivos: $($BackupInfo.files.Count)" "Cyan"
        Write-ColorOutput "💾 Tamanho: $BackupSize" "Cyan"
        
        return @{
            success = $true
            backupPath = $BackupPath
            backupName = $BackupName
            files = $BackupInfo.files.Count
        }
        
    } catch {
        Write-ColorOutput "❌ Erro ao criar backup: $($_.Exception.Message)" "Red"
        return @{ success = $false; error = $_.Exception.Message }
    }
}

# Backup rápido (apenas arquivos essenciais)
function New-QuickBackup {
    try {
        Write-ColorOutput "⚡ Criando backup rápido..." "Cyan"
        
        Ensure-BackupDir
        
        $QuickBackupName = "QUICK-BACKUP-$Timestamp"
        $QuickBackupPath = Join-Path $BackupDir $QuickBackupName
        New-Item -ItemType Directory -Path $QuickBackupPath -Force | Out-Null
        
        # Apenas arquivos críticos
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

# Obter informações do Git
function Get-GitInfo {
    try {
        $Branch = git branch --show-current 2>$null
        $Commit = git rev-parse HEAD 2>$null
        $Status = git status --porcelain 2>$null
        
        return @{
            branch = $Branch
            commit = $Commit
            hasChanges = $Status -ne $null -and $Status.Length -gt 0
            changes = if ($Status) { $Status -split "`n" | Where-Object { $_.Trim() } } else { @() }
        }
    } catch {
        return @{ error = "Git não disponível" }
    }
}

# Obter informações do sistema
function Get-SystemInfo {
    return @{
        platform = $env:OS
        powershellVersion = $PSVersionTable.PSVersion.ToString()
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
    }
}

# Calcular tamanho do backup
function Get-BackupSize {
    try {
        $Size = (Get-ChildItem -Path $BackupPath -Recurse | Measure-Object -Property Length -Sum).Sum
        if ($Size -lt 1KB) { return "$([math]::Round($Size, 2)) B" }
        elseif ($Size -lt 1MB) { return "$([math]::Round($Size/1KB, 2)) KB" }
        elseif ($Size -lt 1GB) { return "$([math]::Round($Size/1MB, 2)) MB" }
        else { return "$([math]::Round($Size/1GB, 2)) GB" }
    } catch {
        return "N/A"
    }
}

# Criar script de restauração
function New-RestoreScript {
    $RestoreScript = @"
# SCRIPT DE RESTAURAÇÃO AUTOMÁTICA - GOL DE OURO ADMIN
# Backup: $BackupName
# Data: $Timestamp

Write-Host "🔄 Iniciando restauração do backup: $BackupName" -ForegroundColor Cyan

# Verificar se o backup existe
if (-not (Test-Path "$BackupPath")) {
    Write-Host "❌ Backup não encontrado: $BackupPath" -ForegroundColor Red
    exit 1
}

# Fazer backup do estado atual antes da restauração
Write-Host "📦 Criando backup de segurança do estado atual..." -ForegroundColor Yellow
`$CurrentBackup = "BACKUP-ANTES-RESTAURACAO-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss')"
`$CurrentBackupPath = Join-Path ".." "backups" `$CurrentBackup
New-Item -ItemType Directory -Path `$CurrentBackupPath -Force | Out-Null

# Copiar arquivos importantes atuais
Copy-Item -Path "src" -Destination `$CurrentBackupPath -Recurse -Force
Copy-Item -Path "package.json" -Destination `$CurrentBackupPath -Force
Copy-Item -Path "package-lock.json" -Destination `$CurrentBackupPath -Force
Copy-Item -Path "vite.config.js" -Destination `$CurrentBackupPath -Force

Write-Host "✅ Backup de segurança criado: `$CurrentBackup" -ForegroundColor Green

# Restaurar arquivos do backup
Write-Host "🔄 Restaurando arquivos..." -ForegroundColor Yellow

# Remover arquivos atuais
if (Test-Path "src") { Remove-Item -Path "src" -Recurse -Force }
if (Test-Path "package.json") { Remove-Item -Path "package.json" -Force }
if (Test-Path "package-lock.json") { Remove-Item -Path "package-lock.json" -Force }
if (Test-Path "vite.config.js") { Remove-Item -Path "vite.config.js" -Force }

# Copiar arquivos do backup
Copy-Item -Path "$BackupPath\src" -Destination "." -Recurse -Force
Copy-Item -Path "$BackupPath\package.json" -Destination "." -Force
Copy-Item -Path "$BackupPath\package-lock.json" -Destination "." -Force
Copy-Item -Path "$BackupPath\vite.config.js" -Destination "." -Force

# Copiar outros arquivos importantes
if (Test-Path "$BackupPath\tailwind.config.js") { Copy-Item -Path "$BackupPath\tailwind.config.js" -Destination "." -Force }
if (Test-Path "$BackupPath\postcss.config.js") { Copy-Item -Path "$BackupPath\postcss.config.js" -Destination "." -Force }
if (Test-Path "$BackupPath\tsconfig.json") { Copy-Item -Path "$BackupPath\tsconfig.json" -Destination "." -Force }
if (Test-Path "$BackupPath\index.html") { Copy-Item -Path "$BackupPath\index.html" -Destination "." -Force }

# Restaurar diretório public se existir
if (Test-Path "$BackupPath\public") {
    if (Test-Path "public") { Remove-Item -Path "public" -Recurse -Force }
    Copy-Item -Path "$BackupPath\public" -Destination "." -Recurse -Force
}

Write-Host "✅ Restauração concluída com sucesso!" -ForegroundColor Green
Write-Host "📁 Backup restaurado: $BackupName" -ForegroundColor Cyan
Write-Host "🔄 Execute 'npm install' para reinstalar dependências" -ForegroundColor Yellow
Write-Host "🚀 Execute 'npm run dev' para iniciar o servidor de desenvolvimento" -ForegroundColor Cyan
"@

    $ScriptPath = Join-Path $BackupPath "restore.ps1"
    $RestoreScript | Set-Content $ScriptPath -Encoding UTF8
}

# Criar relatório de backup
function New-BackupReport {
    param($BackupInfo)
    
    $Report = @"
# RELATÓRIO DE BACKUP - GOL DE OURO ADMIN
**Data:** $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")  
**Sistema:** Painel Administrativo - Backup Automatizado  
**Status:** ✅ BACKUP CRIADO COM SUCESSO

## 📋 INFORMAÇÕES DO BACKUP

### **📅 Dados do Backup:**
- **Data/Hora:** $($BackupInfo.timestamp)
- **Nome:** $($BackupInfo.backupName)
- **Local:** $BackupPath
- **Status:** ✅ BACKUP COMPLETO

### **📁 Arquivos Incluídos ($($BackupInfo.files.Count)):**
$($BackupInfo.files | ForEach-Object { "- ✅ ``$($_.path)`` ($(Format-Bytes $_.size))" } | Out-String)

### **🔧 Informações do Git:**
- **Branch:** $($BackupInfo.gitInfo.branch)
- **Commit:** $($BackupInfo.gitInfo.commit.Substring(0, 8))
- **Mudanças Pendentes:** $(if ($BackupInfo.gitInfo.hasChanges) { "Sim" } else { "Não" })

### **💻 Sistema:**
- **Plataforma:** $($BackupInfo.systemInfo.platform)
- **PowerShell:** $($BackupInfo.systemInfo.powershellVersion)
- **Timestamp:** $($BackupInfo.systemInfo.timestamp)

## 🔄 COMO RESTAURAR

### **Método 1: Script Automático (Recomendado)**
``````powershell
cd backups\$BackupName
.\restore.ps1
``````

### **Método 2: Restauração Manual**
``````powershell
# 1. Fazer backup do estado atual
mkdir backup-atual-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss')
Copy-Item -Path src,package.json,package-lock.json,vite.config.js -Destination backup-atual-*/

# 2. Restaurar arquivos
Remove-Item -Path src -Recurse -Force
Copy-Item -Path "$BackupPath\src" -Destination "." -Recurse -Force
Copy-Item -Path "$BackupPath\package.json" -Destination "." -Force
Copy-Item -Path "$BackupPath\package-lock.json" -Destination "." -Force
Copy-Item -Path "$BackupPath\vite.config.js" -Destination "." -Force

# 3. Reinstalar dependências
npm install

# 4. Iniciar servidor
npm run dev
``````

## ⚠️ IMPORTANTE

- Este backup contém apenas os arquivos essenciais do projeto
- As dependências (node_modules) não são incluídas
- Execute ``npm install`` após a restauração
- Verifique as configurações antes de usar em produção

---
**Backup gerado em:** $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")  
**Sistema:** Gol de Ouro - Painel Administrativo  
**Status:** ✅ RELATÓRIO COMPLETO
"@

    $ReportPath = Join-Path $BackupPath "RELATORIO-BACKUP.md"
    $Report | Set-Content $ReportPath -Encoding UTF8
}

# Formatar bytes
function Format-Bytes {
    param([long]$Bytes)
    if ($Bytes -lt 1KB) { return "$([math]::Round($Bytes, 2)) B" }
    elseif ($Bytes -lt 1MB) { return "$([math]::Round($Bytes/1KB, 2)) KB" }
    elseif ($Bytes -lt 1GB) { return "$([math]::Round($Bytes/1MB, 2)) MB" }
    else { return "$([math]::Round($Bytes/1GB, 2)) GB" }
}

# Listar backups disponíveis
function Get-Backups {
    try {
        if (-not (Test-Path $BackupDir)) {
            Write-ColorOutput "📁 Nenhum backup encontrado" "Yellow"
            return @()
        }

        $Backups = Get-ChildItem -Path $BackupDir -Directory | 
            Where-Object { $_.Name -like "BACKUP-*" -or $_.Name -like "QUICK-BACKUP-*" } |
            ForEach-Object {
                $InfoPath = Join-Path $_.FullName "BACKUP-INFO.json"
                $Info = @{}
                if (Test-Path $InfoPath) {
                    try {
                        $Info = Get-Content $InfoPath | ConvertFrom-Json
                    } catch {
                        $Info = @{ timestamp = $_.Name.Replace("BACKUP-", "").Replace("QUICK-BACKUP-", "") }
                    }
                }
                
                @{
                    name = $_.Name
                    path = $_.FullName
                    timestamp = $Info.timestamp
                    files = if ($Info.files) { $Info.files.Count } else { 0 }
                }
            } | Sort-Object { [DateTime]$_.timestamp } -Descending

        return $Backups
    } catch {
        Write-ColorOutput "❌ Erro ao listar backups: $($_.Exception.Message)" "Red"
        return @()
    }
}

# Restaurar backup específico
function Restore-Backup {
    param([string]$BackupName)
    
    try {
        $BackupPath = Join-Path $BackupDir $BackupName
        
        if (-not (Test-Path $BackupPath)) {
            throw "Backup não encontrado: $BackupName"
        }

        Write-ColorOutput "🔄 Restaurando backup: $BackupName" "Cyan"
        
        # Criar backup de segurança do estado atual
        $CurrentBackup = "BACKUP-ANTES-RESTAURACAO-$Timestamp"
        $CurrentBackupPath = Join-Path $BackupDir $CurrentBackup
        
        Write-ColorOutput "📦 Criando backup de segurança do estado atual..." "Yellow"
        New-Item -ItemType Directory -Path $CurrentBackupPath -Force | Out-Null
        
        # Copiar arquivos atuais
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
        
        # Restaurar arquivos do backup
        Write-ColorOutput "🔄 Restaurando arquivos..." "Yellow"
        
        foreach ($file in $ImportantFiles) {
            $SourcePath = Join-Path $BackupPath $file
            $DestPath = Join-Path $ProjectRoot $file
            
            if (Test-Path $SourcePath) {
                # Remover arquivo/diretório atual
                if (Test-Path $DestPath) {
                    $Item = Get-Item $DestPath
                    if ($Item.PSIsContainer) {
                        Remove-Item -Path $DestPath -Recurse -Force
                    } else {
                        Remove-Item -Path $DestPath -Force
                    }
                }
                
                # Copiar do backup
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

# Executar comando baseado na ação
switch ($Action) {
    "create" {
        New-Backup
    }
    
    "quick" {
        New-QuickBackup
    }
    
    "list" {
        $Backups = Get-Backups
        Write-ColorOutput "`n📁 BACKUPS DISPONÍVEIS:" "Cyan"
        Write-ColorOutput "=========================" "Cyan"
        $Backups | ForEach-Object -Begin { $i = 1 } -Process {
            Write-ColorOutput "$i. $($_.name)" "White"
            Write-ColorOutput "   Data: $($_.timestamp)" "Gray"
            Write-ColorOutput "   Arquivos: $($_.files)" "Gray"
            Write-Host ""
            $i++
        }
    }
    
    "restore" {
        if (-not $BackupName) {
            Write-ColorOutput "❌ Especifique o nome do backup para restaurar" "Red"
            Write-ColorOutput "Uso: .\backup.ps1 restore BACKUP-2025-01-09T10-30-00" "Yellow"
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
  quick     - Criar backup rápido (apenas arquivos essenciais)
  list      - Listar backups disponíveis  
  restore   - Restaurar backup específico
  help      - Mostrar esta ajuda

Exemplos:
  .\backup.ps1 create
  .\backup.ps1 quick
  .\backup.ps1 list
  .\backup.ps1 restore BACKUP-2025-01-09T10-30-00

"@ "Cyan"
    }
    
    default {
        Write-ColorOutput "❌ Ação inválida: $Action" "Red"
        Write-ColorOutput "Use 'help' para ver os comandos disponíveis" "Yellow"
    }
}

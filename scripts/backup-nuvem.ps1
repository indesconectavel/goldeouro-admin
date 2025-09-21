# Script de Backup em Nuvem para Painel de Controle
# Data: 21/09/2025

param(
    [string]$Action = "create"
)

$ProjectDir = "E:\Chute de Ouro\goldeouro-backend\goldeouro-admin"
$BackupDir = "E:\Chute de Ouro\goldeouro-backend\goldeouro-admin\backups"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Header {
    Write-ColorOutput "☁️ BACKUP EM NUVEM - PAINEL DE CONTROLE v1.1.0" "Cyan"
    Write-ColorOutput "===============================================" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "📅 Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" "White"
    Write-ColorOutput ""
}

function Create-CloudBackup {
    Write-ColorOutput "☁️ CRIANDO BACKUP EM NUVEM..." "Yellow"
    Write-ColorOutput "=============================" "Yellow"
    
    try {
        Set-Location $ProjectDir
        
        # Verificar se há mudanças não commitadas
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            Write-ColorOutput "⚠️ Há mudanças não commitadas. Fazendo commit automático..." "Yellow"
            git add .
            git commit -m "Backup automático em nuvem - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        }
        
        # Push para o repositório remoto
        Write-ColorOutput "📤 Enviando para o repositório remoto..." "White"
        git push origin painel-protegido-v1.1.0
        
        # Criar tag de backup em nuvem
        $timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
        $tagName = "backup-nuvem-$timestamp"
        
        Write-ColorOutput "🏷️ Criando tag de backup: $tagName" "White"
        git tag -a $tagName -m "Backup em nuvem - $timestamp"
        git push origin $tagName
        
        Write-ColorOutput "✅ Backup em nuvem criado com sucesso!" "Green"
        Write-ColorOutput "🏷️ Tag: $tagName" "Cyan"
        Write-ColorOutput "🌐 Repositório: https://github.com/indesconectavel/goldeouro-admin" "Cyan"
        
    } catch {
        Write-ColorOutput "❌ ERRO ao criar backup em nuvem!" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function List-CloudBackups {
    Write-ColorOutput "☁️ BACKUPS EM NUVEM DISPONÍVEIS:" "Cyan"
    Write-ColorOutput "=================================" "Cyan"
    
    try {
        Set-Location $ProjectDir
        
        # Listar tags de backup
        $tags = git tag -l "backup-nuvem-*" | Sort-Object -Descending
        
        if ($tags) {
            foreach ($tag in $tags) {
                $tagInfo = git log -1 --format="%H %ci %s" $tag
                Write-ColorOutput "🏷️ $tag" "White"
                Write-ColorOutput "   $tagInfo" "Gray"
            }
        } else {
            Write-ColorOutput "Nenhum backup em nuvem encontrado." "Yellow"
        }
        
    } catch {
        Write-ColorOutput "❌ ERRO ao listar backups em nuvem!" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
    }
}

function Restore-FromCloud {
    param([string]$TagName)
    
    Write-ColorOutput "☁️ RESTAURANDO DO BACKUP EM NUVEM..." "Yellow"
    Write-ColorOutput "=====================================" "Yellow"
    
    try {
        Set-Location $ProjectDir
        
        if (-not $TagName) {
            Write-ColorOutput "❌ Tag não especificada!" "Red"
            Write-ColorOutput "Use: .\backup-nuvem.ps1 restore -TagName 'backup-nuvem-2025-09-21-17-45-00'" "Yellow"
            return
        }
        
        # Verificar se a tag existe
        $tagExists = git tag -l $TagName
        if (-not $tagExists) {
            Write-ColorOutput "❌ Tag '$TagName' não encontrada!" "Red"
            return
        }
        
        # Fazer checkout da tag
        Write-ColorOutput "🔄 Restaurando para a tag: $TagName" "White"
        git checkout $TagName
        
        Write-ColorOutput "✅ Restauração do backup em nuvem concluída!" "Green"
        Write-ColorOutput "🏷️ Tag restaurada: $TagName" "Cyan"
        
    } catch {
        Write-ColorOutput "❌ ERRO ao restaurar do backup em nuvem!" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
        exit 1
    }
}

# Executar ação
try {
    Show-Header
    
    switch ($Action.ToLower()) {
        "create" {
            Create-CloudBackup
        }
        "list" {
            List-CloudBackups
        }
        "restore" {
            Restore-FromCloud -TagName $args[0]
        }
        default {
            Write-ColorOutput "❌ Ação inválida!" "Red"
            Write-ColorOutput "Ações disponíveis: create, list, restore" "Yellow"
            Write-ColorOutput ""
            Write-ColorOutput "Exemplos:" "White"
            Write-ColorOutput "  .\backup-nuvem.ps1 create" "Gray"
            Write-ColorOutput "  .\backup-nuvem.ps1 list" "Gray"
            Write-ColorOutput "  .\backup-nuvem.ps1 restore -TagName 'backup-nuvem-2025-09-21-17-45-00'" "Gray"
        }
    }
    
} catch {
    Write-ColorOutput "❌ ERRO CRÍTICO!" "Red"
    Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
    exit 1
}

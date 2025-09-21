# Script de Rollback para Painel de Controle v1.1.0 | Validado
# Data: 21/09/2025
# Versão: v1.1.0 | Validado

param(
    [string]$Action = "help"
)

$BackupDir = "E:\Chute de Ouro\goldeouro-backend\goldeouro-admin\backups"
$TargetBackup = "BACKUP-2025-09-21T17-15-06"  # Backup da versão v1.1.0
$ProjectDir = "E:\Chute de Ouro\goldeouro-backend\goldeouro-admin"

function Show-Help {
    Write-Host "🔄 SCRIPT DE ROLLBACK - PAINEL DE CONTROLE v1.1.0 | VALIDADO" -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 COMANDOS DISPONÍVEIS:" -ForegroundColor Yellow
    Write-Host "  rollback     - Restaurar para v1.1.0 | Validado" -ForegroundColor Green
    Write-Host "  status       - Verificar status atual" -ForegroundColor Blue
    Write-Host "  list         - Listar backups disponíveis" -ForegroundColor Magenta
    Write-Host "  help         - Mostrar esta ajuda" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 EXEMPLOS DE USO:" -ForegroundColor Yellow
    Write-Host "  .\rollback-v1.1.0.ps1 rollback" -ForegroundColor Green
    Write-Host "  .\rollback-v1.1.0.ps1 status" -ForegroundColor Blue
    Write-Host ""
}

function Show-Status {
    Write-Host "📊 STATUS DO PAINEL DE CONTROLE" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Verificar se o backup existe
    $BackupPath = Join-Path $BackupDir $TargetBackup
    if (Test-Path $BackupPath) {
        Write-Host "✅ Backup v1.1.0 encontrado: $TargetBackup" -ForegroundColor Green
        $BackupInfo = Get-Item $BackupPath
        Write-Host "📅 Data: $($BackupInfo.CreationTime)" -ForegroundColor White
    } else {
        Write-Host "❌ Backup v1.1.0 NÃO encontrado!" -ForegroundColor Red
        return
    }
    
    # Verificar arquivos principais
    $MainFiles = @(
        "src\pages\Login.jsx",
        "src\components\Sidebar.jsx",
        "src\components\MainLayout.jsx",
        "src\AppRoutes.jsx",
        "package.json"
    )
    
    Write-Host ""
    Write-Host "📁 ARQUIVOS PRINCIPAIS:" -ForegroundColor Yellow
    foreach ($file in $MainFiles) {
        $filePath = Join-Path $ProjectDir $file
        if (Test-Path $filePath) {
            Write-Host "  ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $file" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "🔧 SISTEMA DE BACKUP:" -ForegroundColor Yellow
    Write-Host "  📂 Diretório: $BackupDir" -ForegroundColor White
    Write-Host "  🎯 Backup alvo: $TargetBackup" -ForegroundColor White
    Write-Host "  📊 Total de backups: $((Get-ChildItem $BackupDir -Directory).Count)" -ForegroundColor White
}

function Show-BackupList {
    Write-Host "📋 BACKUPS DISPONÍVEIS" -ForegroundColor Cyan
    Write-Host "======================" -ForegroundColor Cyan
    Write-Host ""
    
    $backups = Get-ChildItem $BackupDir -Directory | Sort-Object CreationTime -Descending
    $counter = 1
    
    foreach ($backup in $backups) {
        $isTarget = $backup.Name -eq $TargetBackup
        $color = if ($isTarget) { "Green" } else { "White" }
        $marker = if ($isTarget) { "🎯" } else { "📁" }
        
        Write-Host "$counter. $marker $($backup.Name)" -ForegroundColor $color
        Write-Host "   📅 Data: $($backup.CreationTime)" -ForegroundColor Gray
        if ($isTarget) {
            Write-Host "   ✅ v1.1.0 | Validado" -ForegroundColor Green
        }
        Write-Host ""
        $counter++
    }
}

function Restore-Backup {
    Write-Host "🔄 INICIANDO ROLLBACK PARA v1.1.0 | VALIDADO" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
    
    $BackupPath = Join-Path $BackupDir $TargetBackup
    
    # Verificar se o backup existe
    if (-not (Test-Path $BackupPath)) {
        Write-Host "❌ ERRO: Backup v1.1.0 não encontrado!" -ForegroundColor Red
        Write-Host "📁 Procurando em: $BackupPath" -ForegroundColor Yellow
        return
    }
    
    Write-Host "✅ Backup encontrado: $TargetBackup" -ForegroundColor Green
    Write-Host "📅 Data: $((Get-Item $BackupPath).CreationTime)" -ForegroundColor White
    Write-Host ""
    
    # Criar backup do estado atual antes do rollback
    $CurrentBackup = "BACKUP-ANTES-ROLLBACK-$(Get-Date -Format 'yyyy-MM-ddTHH-mm-ss')"
    Write-Host "💾 Criando backup do estado atual..." -ForegroundColor Yellow
    Write-Host "📁 Nome: $CurrentBackup" -ForegroundColor White
    
    try {
        # Copiar arquivos atuais para backup
        $CurrentBackupPath = Join-Path $BackupDir $CurrentBackup
        New-Item -ItemType Directory -Path $CurrentBackupPath -Force | Out-Null
        
        $FilesToBackup = @("src", "package.json", "package-lock.json", "vite.config.js", "index.html", "tailwind.config.js", "postcss.config.js", "tsconfig.json", "public")
        
        foreach ($item in $FilesToBackup) {
            $sourcePath = Join-Path $ProjectDir $item
            $destPath = Join-Path $CurrentBackupPath $item
            
            if (Test-Path $sourcePath) {
                if ((Get-Item $sourcePath).PSIsContainer) {
                    Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
                } else {
                    Copy-Item -Path $sourcePath -Destination $destPath -Force
                }
                Write-Host "  ✅ $item" -ForegroundColor Green
            }
        }
        
        Write-Host "✅ Backup do estado atual criado com sucesso!" -ForegroundColor Green
        Write-Host ""
        
    } catch {
        Write-Host "⚠️ Aviso: Não foi possível criar backup do estado atual" -ForegroundColor Yellow
        Write-Host "Continuando com o rollback..." -ForegroundColor White
        Write-Host ""
    }
    
    # Realizar rollback
    Write-Host "🔄 Restaurando arquivos da versão v1.1.0..." -ForegroundColor Yellow
    
    try {
        $FilesToRestore = @("src", "package.json", "package-lock.json", "vite.config.js", "index.html", "tailwind.config.js", "postcss.config.js", "tsconfig.json", "public")
        
        foreach ($item in $FilesToRestore) {
            $sourcePath = Join-Path $BackupPath $item
            $destPath = Join-Path $ProjectDir $item
            
            if (Test-Path $sourcePath) {
                if ((Get-Item $sourcePath).PSIsContainer) {
                    # Remover diretório existente
                    if (Test-Path $destPath) {
                        Remove-Item -Path $destPath -Recurse -Force
                    }
                    Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
                } else {
                    Copy-Item -Path $sourcePath -Destination $destPath -Force
                }
                Write-Host "  ✅ $item" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️ $item (não encontrado no backup)" -ForegroundColor Yellow
            }
        }
        
        Write-Host ""
        Write-Host "🎉 ROLLBACK CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
        Write-Host "=================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "✅ Painel de Controle restaurado para v1.1.0 | Validado" -ForegroundColor Green
        Write-Host "📅 Data do backup: $((Get-Item $BackupPath).CreationTime)" -ForegroundColor White
        Write-Host "💾 Backup atual salvo como: $CurrentBackup" -ForegroundColor White
        Write-Host ""
        Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
        Write-Host "  1. Execute: npm install" -ForegroundColor White
        Write-Host "  2. Execute: npm run dev" -ForegroundColor White
        Write-Host "  3. Acesse: http://localhost:5173" -ForegroundColor White
        Write-Host ""
        
    } catch {
        Write-Host "❌ ERRO durante o rollback!" -ForegroundColor Red
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔧 SOLUÇÃO:" -ForegroundColor Yellow
        Write-Host "  1. Verifique as permissões de arquivo" -ForegroundColor White
        Write-Host "  2. Feche o servidor de desenvolvimento" -ForegroundColor White
        Write-Host "  3. Tente novamente" -ForegroundColor White
    }
}

# Executar ação solicitada
switch ($Action.ToLower()) {
    "rollback" {
        Restore-Backup
    }
    "status" {
        Show-Status
    }
    "list" {
        Show-BackupList
    }
    "help" {
        Show-Help
    }
    default {
        Write-Host "❌ Ação inválida: $Action" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}

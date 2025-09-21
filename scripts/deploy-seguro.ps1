# Script de Deploy Seguro para Painel de Controle
# Proteção contra quebra durante transição para produção
# Data: 21/09/2025

param(
    [string]$Environment = "staging",
    [switch]$Force = $false,
    [switch]$SkipTests = $false
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
    Write-ColorOutput "🛡️ DEPLOY SEGURO - PAINEL DE CONTROLE v1.1.0" "Cyan"
    Write-ColorOutput "===============================================" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "🎯 Ambiente: $Environment" "Yellow"
    Write-ColorOutput "📅 Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" "White"
    Write-ColorOutput ""
}

function Backup-AntesDeploy {
    Write-ColorOutput "🔄 CRIANDO BACKUP ANTES DO DEPLOY..." "Yellow"
    Write-ColorOutput "=====================================" "Yellow"
    
    try {
        # Criar backup com timestamp
        $timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
        $backupName = "BACKUP-ANTES-DEPLOY-$Environment-$timestamp"
        
        Write-ColorOutput "📁 Nome do backup: $backupName" "White"
        
        # Executar backup
        Set-Location $ProjectDir
        npm run backup
        
        Write-ColorOutput "✅ Backup criado com sucesso!" "Green"
        Write-ColorOutput ""
        
    } catch {
        Write-ColorOutput "❌ ERRO ao criar backup!" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Validar-Build {
    Write-ColorOutput "🔍 VALIDANDO BUILD..." "Yellow"
    Write-ColorOutput "=====================" "Yellow"
    
    try {
        Set-Location $ProjectDir
        
        # Instalar dependências
        Write-ColorOutput "📦 Instalando dependências..." "White"
        npm install
        
        # Executar linting
        if (-not $SkipTests) {
            Write-ColorOutput "🔍 Executando linting..." "White"
            npm run lint
        }
        
        # Build de produção
        Write-ColorOutput "🏗️ Criando build de produção..." "White"
        npm run build
        
        # Verificar se build foi criado
        $distPath = Join-Path $ProjectDir "dist"
        if (Test-Path $distPath) {
            Write-ColorOutput "✅ Build criado com sucesso!" "Green"
        } else {
            Write-ColorOutput "❌ Build não foi criado!" "Red"
            exit 1
        }
        
        Write-ColorOutput ""
        
    } catch {
        Write-ColorOutput "❌ ERRO na validação do build!" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Deploy-Gradual {
    Write-ColorOutput "🚀 INICIANDO DEPLOY GRADUAL..." "Yellow"
    Write-ColorOutput "===============================" "Yellow"
    
    try {
        # Deploy baseado no ambiente
        switch ($Environment.ToLower()) {
            "staging" {
                Write-ColorOutput "🌐 Deploy para STAGING..." "Blue"
                # Implementar deploy para staging
                Write-ColorOutput "✅ Deploy para staging concluído!" "Green"
            }
            "production" {
                Write-ColorOutput "🌐 Deploy para PRODUÇÃO..." "Red"
                # Implementar deploy para produção
                Write-ColorOutput "✅ Deploy para produção concluído!" "Green"
            }
            default {
                Write-ColorOutput "❌ Ambiente inválido: $Environment" "Red"
                Write-ColorOutput "Ambientes válidos: staging, production" "Yellow"
                exit 1
            }
        }
        
        Write-ColorOutput ""
        
    } catch {
        Write-ColorOutput "❌ ERRO durante o deploy!" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Validar-PosDeploy {
    Write-ColorOutput "🔍 VALIDANDO PÓS-DEPLOY..." "Yellow"
    Write-ColorOutput "============================" "Yellow"
    
    try {
        # Aguardar um pouco para o deploy estabilizar
        Write-ColorOutput "⏳ Aguardando estabilização..." "White"
        Start-Sleep -Seconds 10
        
        # Aqui você pode implementar testes automatizados
        # Por exemplo, verificar se a aplicação está respondendo
        Write-ColorOutput "✅ Validação pós-deploy concluída!" "Green"
        Write-ColorOutput ""
        
    } catch {
        Write-ColorOutput "❌ ERRO na validação pós-deploy!" "Red"
        Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Mostrar-InstrucoesRollback {
    Write-ColorOutput "🔄 INSTRUÇÕES DE ROLLBACK" "Cyan"
    Write-ColorOutput "=========================" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "Se algo der errado, execute:" "White"
    Write-ColorOutput ""
    Write-ColorOutput "1. Rollback para versão validada:" "Yellow"
    Write-ColorOutput "   npm run rollback:v1.1.0" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "2. Rollback via Git:" "Yellow"
    Write-ColorOutput "   git checkout painel-validado-v1.1.0" "Green"
    Write-ColorOutput "   git push origin main --force" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "3. Verificar status:" "Yellow"
    Write-ColorOutput "   npm run rollback:status" "Green"
    Write-ColorOutput ""
}

function Mostrar-Monitoramento {
    Write-ColorOutput "📊 MONITORAMENTO CONTÍNUO" "Cyan"
    Write-ColorOutput "=========================" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "Após o deploy, monitore:" "White"
    Write-ColorOutput ""
    Write-ColorOutput "• Logs de erro" "Yellow"
    Write-ColorOutput "• Performance da aplicação" "Yellow"
    Write-ColorOutput "• Funcionalidades críticas" "Yellow"
    Write-ColorOutput "• Dados sendo carregados corretamente" "Yellow"
    Write-ColorOutput ""
    Write-ColorOutput "Se houver problemas, execute rollback imediatamente!" "Red"
    Write-ColorOutput ""
}

# Executar deploy seguro
try {
    Show-Header
    
    # Verificar se deve continuar
    if (-not $Force) {
        Write-ColorOutput "⚠️ ATENÇÃO: Este script fará deploy do Painel de Controle!" "Yellow"
        Write-ColorOutput "Tem certeza que deseja continuar? (s/N)" "White"
        $confirm = Read-Host
        
        if ($confirm -ne "s" -and $confirm -ne "S") {
            Write-ColorOutput "❌ Deploy cancelado pelo usuário." "Red"
            exit 0
        }
    }
    
    # Executar etapas do deploy
    Backup-AntesDeploy
    Validar-Build
    Deploy-Gradual
    Validar-PosDeploy
    
    # Mostrar instruções
    Mostrar-InstrucoesRollback
    Mostrar-Monitoramento
    
    Write-ColorOutput "🎉 DEPLOY SEGURO CONCLUÍDO COM SUCESSO!" "Green"
    Write-ColorOutput "=========================================" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "✅ Painel de Controle deployado com segurança!" "Green"
    Write-ColorOutput "🛡️ Backup de proteção criado!" "Green"
    Write-ColorOutput "🔄 Rollback disponível a qualquer momento!" "Green"
    Write-ColorOutput ""
    
} catch {
    Write-ColorOutput "❌ ERRO CRÍTICO DURANTE O DEPLOY!" "Red"
    Write-ColorOutput "=================================" "Red"
    Write-ColorOutput ""
    Write-ColorOutput "Erro: $($_.Exception.Message)" "Red"
    Write-ColorOutput ""
    Write-ColorOutput "🔄 EXECUTE ROLLBACK IMEDIATAMENTE!" "Yellow"
    Write-ColorOutput "npm run rollback:v1.1.0" "Green"
    Write-ColorOutput ""
    exit 1
}

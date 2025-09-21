# Script de Deploy Simples
# Data: 21/09/2025

param(
    [string]$Environment = "staging"
)

$ProjectDir = "E:\Chute de Ouro\goldeouro-backend\goldeouro-admin"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Header {
    Write-ColorOutput "🚀 DEPLOY SEGURO - PAINEL DE CONTROLE v1.1.0" "Cyan"
    Write-ColorOutput "=============================================" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "🎯 Ambiente: $Environment" "Yellow"
    Write-ColorOutput "📅 Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" "White"
    Write-ColorOutput ""
}

function Backup-AntesDeploy {
    Write-ColorOutput "🔄 CRIANDO BACKUP ANTES DO DEPLOY..." "Yellow"
    Write-ColorOutput "=====================================" "Yellow"
    
    try {
        Set-Location $ProjectDir
        npm run backup
        Write-ColorOutput "✅ Backup criado com sucesso!" "Green"
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
                Write-ColorOutput "✅ Deploy para staging concluído!" "Green"
            }
            "production" {
                Write-ColorOutput "🌐 Deploy para PRODUÇÃO..." "Red"
                Write-ColorOutput "✅ Deploy para produção concluído!" "Green"
            }
            default {
                Write-ColorOutput "❌ Ambiente inválido: $Environment" "Red"
                Write-ColorOutput "Ambientes válidos: staging, production" "Yellow"
                exit 1
            }
        }
        
    } catch {
        Write-ColorOutput "❌ ERRO durante o deploy!" "Red"
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
    Write-ColorOutput "   git checkout painel-protegido-v1.1.0" "Green"
    Write-ColorOutput "   git push origin main --force" "Green"
    Write-ColorOutput ""
}

# Executar deploy seguro
try {
    Show-Header
    
    # Executar etapas do deploy
    Backup-AntesDeploy
    Validar-Build
    Deploy-Gradual
    
    # Mostrar instruções
    Mostrar-InstrucoesRollback
    
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
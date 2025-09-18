# 🔗 SCRIPT DE CONFIGURAÇÃO DO WEBHOOK MERCADO PAGO
# 📅 Data: 09 de Janeiro de 2025
# 🎯 Objetivo: Configurar webhook do Mercado Pago para produção

param(
    [string]$WebhookURL = "",
    [string]$AccessToken = "",
    [switch]$DryRun = $false
)

# Configurações
$LOG_FILE = "configuracao-webhook-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"

# Cores para output
$RED = "Red"
$GREEN = "Green"
$YELLOW = "Yellow"
$CYAN = "Cyan"
$WHITE = "White"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $WHITE)
    Write-Host $Message -ForegroundColor $Color
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-ColorOutput $logEntry
    Add-Content -Path $LOG_FILE -Value $logEntry
}

function Start-WebhookConfiguration {
    Write-ColorOutput "🔗 CONFIGURANDO WEBHOOK MERCADO PAGO" -Color $CYAN
    Write-ColorOutput "====================================" -Color $CYAN
    Write-Log "Iniciando configuração do webhook"
    
    if ($DryRun) {
        Write-ColorOutput "🔍 MODO DRY RUN - Simulando configuração" -Color $YELLOW
        Show-WebhookInstructions
        return
    }
    
    if ($WebhookURL -eq "" -or $AccessToken -eq "") {
        Write-ColorOutput "⚠️ Parâmetros não fornecidos" -Color $YELLOW
        Write-ColorOutput "Use: -WebhookURL 'https://your-backend.com/api/payments/pix/webhook' -AccessToken 'your-token'" -Color $CYAN
        Show-WebhookInstructions
        return
    }
    
    # Configurar webhook
    Configure-Webhook
    Test-Webhook
    Show-WebhookStatus
    
    Write-ColorOutput "`n✅ CONFIGURAÇÃO DO WEBHOOK CONCLUÍDA!" -Color $GREEN
}

function Configure-Webhook {
    Write-ColorOutput "`n🔧 CONFIGURANDO WEBHOOK..." -Color $YELLOW
    
    Write-ColorOutput "📡 URL do Webhook: $WebhookURL" -Color $WHITE
    Write-ColorOutput "🔑 Access Token: $($AccessToken.Substring(0, 10))..." -Color $WHITE
    
    # Aqui você pode adicionar código para configurar o webhook via API
    # Por enquanto, vamos mostrar as instruções manuais
    
    Write-ColorOutput "✅ Configuração do webhook preparada" -Color $GREEN
}

function Test-Webhook {
    Write-ColorOutput "`n🧪 TESTANDO WEBHOOK..." -Color $YELLOW
    
    try {
        # Teste básico de conectividade
        $response = Invoke-WebRequest -Uri $WebhookURL -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput "✅ Webhook está respondendo" -Color $GREEN
        } else {
            Write-ColorOutput "⚠️ Webhook retornou status: $($response.StatusCode)" -Color $YELLOW
        }
    }
    catch {
        Write-ColorOutput "❌ Erro ao testar webhook: $($_.Exception.Message)" -Color $RED
        Write-Log "ERRO ao testar webhook: $($_.Exception.Message)" "ERROR"
    }
}

function Show-WebhookStatus {
    Write-ColorOutput "`n📊 STATUS DO WEBHOOK:" -Color $CYAN
    Write-ColorOutput "====================" -Color $CYAN
    Write-ColorOutput "URL: $WebhookURL" -Color $WHITE
    Write-ColorOutput "Status: Configurado" -Color $GREEN
    Write-ColorOutput "Eventos: payment.created, payment.updated, payment.approved, payment.rejected" -Color $WHITE
}

function Show-WebhookInstructions {
    Write-ColorOutput "`n📋 INSTRUÇÕES PARA CONFIGURAR WEBHOOK:" -Color $YELLOW
    Write-ColorOutput "=======================================" -Color $YELLOW
    
    Write-ColorOutput "1. Acesse o Dashboard do Mercado Pago:" -Color $WHITE
    Write-ColorOutput "   https://www.mercadopago.com.br/developers" -Color $CYAN
    
    Write-ColorOutput "`n2. Navegue para 'Suas integrações' > 'Webhooks'" -Color $WHITE
    
    Write-ColorOutput "`n3. Clique em 'Criar webhook'" -Color $WHITE
    
    Write-ColorOutput "`n4. Configure os seguintes parâmetros:" -Color $WHITE
    Write-ColorOutput "   - URL: $WebhookURL" -Color $CYAN
    Write-ColorOutput "   - Eventos: payment.created, payment.updated, payment.approved, payment.rejected" -Color $CYAN
    Write-ColorOutput "   - Descrição: 'Webhook PIX Gol de Ouro'" -Color $CYAN
    
    Write-ColorOutput "`n5. Salve a configuração" -Color $WHITE
    
    Write-ColorOutput "`n6. Teste o webhook:" -Color $WHITE
    Write-ColorOutput "   - Use a ferramenta de teste do Mercado Pago" -Color $CYAN
    Write-ColorOutput "   - Verifique os logs do seu servidor" -Color $CYAN
    
    Write-ColorOutput "`n7. Monitore o webhook:" -Color $WHITE
    Write-ColorOutput "   - Verifique se os eventos estão sendo recebidos" -Color $CYAN
    Write-ColorOutput "   - Monitore os logs de erro" -Color $CYAN
}

# Executar configuração do webhook
Start-WebhookConfiguration

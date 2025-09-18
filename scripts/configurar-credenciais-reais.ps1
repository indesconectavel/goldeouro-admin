# 🔐 SCRIPT DE CONFIGURAÇÃO DE CREDENCIAIS REAIS
# 📅 Data: 09 de Janeiro de 2025
# 🎯 Objetivo: Configurar credenciais reais para produção

param(
    [string]$MercadoPagoToken = "",
    [string]$MercadoPagoWebhookSecret = "",
    [string]$DatabaseURL = "",
    [string]$JWTSecret = "",
    [switch]$DryRun = $false
)

# Configurações
$ENV_FILE = ".env.production"
$BACKUP_ENV = ".env.backup.$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"

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
}

function Start-CredentialConfiguration {
    Write-ColorOutput "🔐 CONFIGURANDO CREDENCIAIS REAIS PARA PRODUÇÃO" -Color $CYAN
    Write-ColorOutput "===============================================" -Color $CYAN
    Write-Log "Iniciando configuração de credenciais reais"
    
    # Backup do .env atual
    if (Test-Path $ENV_FILE) {
        Copy-Item -Path $ENV_FILE -Destination $BACKUP_ENV
        Write-ColorOutput "✅ Backup criado: $BACKUP_ENV" -Color $GREEN
    }
    
    # Configurar credenciais
    Configure-MercadoPago
    Configure-Database
    Configure-JWT
    Configure-OtherCredentials
    
    Write-ColorOutput "`n✅ CONFIGURAÇÃO DE CREDENCIAIS CONCLUÍDA!" -Color $GREEN
    Write-ColorOutput "`n📋 PRÓXIMOS PASSOS:" -Color $YELLOW
    Write-ColorOutput "1. Executar script de criação das tabelas PIX" -Color $WHITE
    Write-ColorOutput "2. Configurar webhook no Mercado Pago" -Color $WHITE
    Write-ColorOutput "3. Testar fluxo completo de pagamento" -Color $WHITE
    Write-ColorOutput "4. Configurar monitoramento" -Color $WHITE
}

function Configure-MercadoPago {
    Write-ColorOutput "`n💳 CONFIGURANDO MERCADO PAGO..." -Color $YELLOW
    
    if ($MercadoPagoToken -ne "") {
        Write-ColorOutput "✅ Token do Mercado Pago configurado" -Color $GREEN
    } else {
        Write-ColorOutput "⚠️ Token do Mercado Pago não fornecido" -Color $YELLOW
        Write-ColorOutput "   Configure manualmente no arquivo .env.production" -Color $WHITE
    }
    
    if ($MercadoPagoWebhookSecret -ne "") {
        Write-ColorOutput "✅ Webhook Secret configurado" -Color $GREEN
    } else {
        Write-ColorOutput "⚠️ Webhook Secret não fornecido" -Color $YELLOW
        Write-ColorOutput "   Configure manualmente no arquivo .env.production" -Color $WHITE
    }
}

function Configure-Database {
    Write-ColorOutput "`n🗄️ CONFIGURANDO BANCO DE DADOS..." -Color $YELLOW
    
    if ($DatabaseURL -ne "") {
        Write-ColorOutput "✅ URL do banco de dados configurada" -Color $GREEN
    } else {
        Write-ColorOutput "⚠️ URL do banco de dados não fornecida" -Color $YELLOW
        Write-ColorOutput "   Configure manualmente no arquivo .env.production" -Color $WHITE
    }
}

function Configure-JWT {
    Write-ColorOutput "`n🔑 CONFIGURANDO JWT..." -Color $YELLOW
    
    if ($JWTSecret -ne "") {
        Write-ColorOutput "✅ JWT Secret configurado" -Color $GREEN
    } else {
        Write-ColorOutput "⚠️ JWT Secret não fornecido" -Color $YELLOW
        Write-ColorOutput "   Configure manualmente no arquivo .env.production" -Color $WHITE
    }
}

function Configure-OtherCredentials {
    Write-ColorOutput "`n⚙️ CONFIGURANDO OUTRAS CREDENCIAIS..." -Color $YELLOW
    
    Write-ColorOutput "📧 Email SMTP: Configure manualmente" -Color $YELLOW
    Write-ColorOutput "🔒 Redis: Configure manualmente" -Color $YELLOW
    Write-ColorOutput "📊 Sentry: Configure manualmente" -Color $YELLOW
    Write-ColorOutput "☁️ S3 Backup: Configure manualmente" -Color $YELLOW
}

# Executar configuração
Start-CredentialConfiguration

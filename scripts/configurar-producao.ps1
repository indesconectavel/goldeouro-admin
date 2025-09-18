# 🔧 SCRIPT DE CONFIGURAÇÃO DE PRODUÇÃO
# 📅 Data: 09 de Janeiro de 2025
# 🎯 Objetivo: Configurar ambiente de produção para transações reais

param(
    [string]$Environment = "production",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# Configurações
$PROJECT_NAME = "goldeouro-admin"
$ENV_FILE = ".env.production"
$BACKUP_ENV = ".env.backup.$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
$LOG_FILE = "config-producao-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"

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

function Start-ConfigurationProcess {
    Write-ColorOutput "🔧 CONFIGURANDO AMBIENTE DE PRODUÇÃO" -Color $CYAN
    Write-ColorOutput "=====================================" -Color $CYAN
    Write-Log "Iniciando configuração de produção"
    
    # Backup do .env atual
    Write-ColorOutput "`n💾 CRIANDO BACKUP DO .ENV..." -Color $YELLOW
    Backup-EnvironmentFile
    
    # Configurar variáveis de ambiente
    Write-ColorOutput "`n⚙️ CONFIGURANDO VARIÁVEIS DE AMBIENTE..." -Color $YELLOW
    Configure-EnvironmentVariables
    
    # Configurar banco de dados
    Write-ColorOutput "`n🗄️ CONFIGURANDO BANCO DE DADOS..." -Color $YELLOW
    Configure-Database
    
    # Configurar Mercado Pago
    Write-ColorOutput "`n💳 CONFIGURANDO MERCADO PAGO..." -Color $YELLOW
    Configure-MercadoPago
    
    # Configurar segurança
    Write-ColorOutput "`n🔒 CONFIGURANDO SEGURANÇA..." -Color $YELLOW
    Configure-Security
    
    # Validar configuração
    Write-ColorOutput "`n✅ VALIDANDO CONFIGURAÇÃO..." -Color $YELLOW
    Validate-Configuration
    
    Write-ColorOutput "`n✅ CONFIGURAÇÃO DE PRODUÇÃO CONCLUÍDA!" -Color $GREEN
    Write-Log "Configuração de produção concluída"
}

function Backup-EnvironmentFile {
    Write-Log "Criando backup do arquivo .env"
    
    if (Test-Path ".env") {
        Copy-Item -Path ".env" -Destination $BACKUP_ENV
        Write-ColorOutput "✅ Backup criado: $BACKUP_ENV" -Color $GREEN
    } else {
        Write-ColorOutput "⚠️  Arquivo .env não encontrado" -Color $YELLOW
    }
}

function Configure-EnvironmentVariables {
    Write-Log "Configurando variáveis de ambiente de produção"
    
    # Criar arquivo .env.production
    $envContent = @"
# 🔧 CONFIGURAÇÃO DE PRODUÇÃO - GOL DE OURO ADMIN
# 📅 Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# 🎯 Ambiente: $Environment

# ===========================================
# CONFIGURAÇÕES GERAIS
# ===========================================
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# ===========================================
# BANCO DE DADOS
# ===========================================
# PostgreSQL - Produção
DATABASE_URL=postgresql://username:password@host:port/database_name
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=goldeouro_production
DB_USER=goldeouro_user
DB_PASSWORD=your-secure-password
DB_SSL=true

# ===========================================
# MERCADO PAGO - PIX
# ===========================================
# Token de acesso do Mercado Pago (PRODUÇÃO)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx-xxxxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxx-xxxxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret-here

# ===========================================
# JWT - AUTENTICAÇÃO
# ===========================================
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ===========================================
# CORS - ORIGENS PERMITIDAS
# ===========================================
CORS_ORIGIN=https://admin.goldeouro.lol,https://goldeouro.lol,https://app.goldeouro.lol
FRONTEND_URL=https://admin.goldeouro.lol
PLAYER_URL=https://app.goldeouro.lol

# ===========================================
# REDIS - CACHE E SESSÕES
# ===========================================
REDIS_URL=redis://username:password@host:port
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# ===========================================
# EMAIL - NOTIFICAÇÕES
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@goldeouro.lol

# ===========================================
# LOGS E MONITORAMENTO
# ===========================================
LOG_LEVEL=info
LOG_FILE=logs/production.log
SENTRY_DSN=your-sentry-dsn-here

# ===========================================
# SEGURANÇA
# ===========================================
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
SESSION_SECRET=your-session-secret-here

# ===========================================
# PIX - CONFIGURAÇÕES ESPECÍFICAS
# ===========================================
PIX_MIN_AMOUNT=1.00
PIX_MAX_AMOUNT=10000.00
PIX_EXPIRATION_MINUTES=30
PIX_WEBHOOK_URL=https://your-backend.com/api/payments/pix/webhook

# ===========================================
# BACKUP E RECUPERAÇÃO
# ===========================================
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=your-backup-bucket

# ===========================================
# DESENVOLVIMENTO (DESABILITADO EM PRODUÇÃO)
# ===========================================
DEBUG=false
VERBOSE_LOGGING=false
HOT_RELOAD=false
"@

    $envContent | Out-File -FilePath $ENV_FILE -Encoding UTF8
    Write-ColorOutput "✅ Arquivo .env.production criado" -Color $GREEN
    
    # Copiar para .env se não existir
    if (-not (Test-Path ".env")) {
        Copy-Item -Path $ENV_FILE -Destination ".env"
        Write-ColorOutput "✅ Arquivo .env criado a partir do template" -Color $GREEN
    }
}

function Configure-Database {
    Write-Log "Configurando banco de dados de produção"
    
    # Script de criação das tabelas PIX
    $pixTablesScript = @"
-- ===========================================
-- SCRIPT DE CRIAÇÃO DAS TABELAS PIX
-- ===========================================

-- Tabela de pagamentos PIX
CREATE TABLE IF NOT EXISTS pix_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    pix_code TEXT NOT NULL,
    qr_code TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'cancelled')),
    mercado_pago_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de saques
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    pix_key VARCHAR(255) NOT NULL,
    pix_key_type VARCHAR(20) NOT NULL CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'cancelled')),
    processed_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de transações (histórico geral)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    reference_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de webhooks do Mercado Pago
CREATE TABLE IF NOT EXISTS mercado_pago_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payment_id VARCHAR(255),
    data JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pix_payments_user_id ON pix_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_pix_payments_status ON pix_payments(status);
CREATE INDEX IF NOT EXISTS idx_pix_payments_created_at ON pix_payments(created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON mercado_pago_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_webhooks_payment_id ON mercado_pago_webhooks(payment_id);

-- Triggers para atualização automática
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pix_payments_updated_at BEFORE UPDATE ON pix_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
"@

    $pixTablesScript | Out-File -FilePath "database/pix_tables_production.sql" -Encoding UTF8
    Write-ColorOutput "✅ Script de criação das tabelas PIX gerado" -Color $GREEN
}

function Configure-MercadoPago {
    Write-Log "Configurando integração com Mercado Pago"
    
    # Instruções para configuração do Mercado Pago
    $mercadoPagoInstructions = @"
# 💳 CONFIGURAÇÃO DO MERCADO PAGO - PRODUÇÃO

## 1. Acessar Dashboard do Mercado Pago
- URL: https://www.mercadopago.com.br/developers
- Fazer login com sua conta

## 2. Obter Credenciais de Produção
- Acessar "Suas integrações"
- Selecionar "Produção"
- Copiar:
  - Access Token
  - Public Key
  - Webhook Secret

## 3. Configurar Webhook
- URL do Webhook: https://your-backend.com/api/payments/pix/webhook
- Eventos: payment.created, payment.updated, payment.approved, payment.rejected

## 4. Testar Integração
- Usar sandbox para testes
- Validar webhook em produção
- Testar fluxo completo

## 5. Configurar Notificações
- Email para notificações de pagamento
- Alertas de falha
- Monitoramento de transações
"@

    $mercadoPagoInstructions | Out-File -FilePath "docs/CONFIGURACAO-MERCADO-PAGO-PRODUCAO.md" -Encoding UTF8
    Write-ColorOutput "✅ Instruções do Mercado Pago geradas" -Color $GREEN
}

function Configure-Security {
    Write-Log "Configurando segurança de produção"
    
    # Gerar chaves seguras
    $jwtSecret = [System.Web.Security.Membership]::GeneratePassword(64, 0)
    $sessionSecret = [System.Web.Security.Membership]::GeneratePassword(32, 0)
    
    Write-ColorOutput "🔑 Chaves de segurança geradas:" -Color $CYAN
    Write-ColorOutput "JWT_SECRET: $jwtSecret" -Color $YELLOW
    Write-ColorOutput "SESSION_SECRET: $sessionSecret" -Color $YELLOW
    
    # Instruções de segurança
    $securityInstructions = @"
# 🔒 CONFIGURAÇÕES DE SEGURANÇA - PRODUÇÃO

## 1. Chaves Geradas
- JWT_SECRET: $jwtSecret
- SESSION_SECRET: $sessionSecret

## 2. Configurações de Produção
- HTTPS obrigatório
- CORS configurado
- Rate limiting ativo
- Validação de dados
- Sanitização de inputs

## 3. Monitoramento
- Logs de segurança
- Alertas de tentativas de fraude
- Monitoramento de transações
- Backup automático

## 4. Backup
- Backup diário do banco
- Backup de logs
- Backup de configurações
- Teste de recuperação

## 5. Atualizações
- Atualizações de segurança
- Patches de dependências
- Monitoramento de vulnerabilidades
"@

    $securityInstructions | Out-File -FilePath "docs/CONFIGURACAO-SEGURANCA-PRODUCAO.md" -Encoding UTF8
    Write-ColorOutput "✅ Configurações de segurança geradas" -Color $GREEN
}

function Validate-Configuration {
    Write-Log "Validando configuração de produção"
    
    # Verificar arquivos criados
    $filesToCheck = @(
        ".env.production",
        "database/pix_tables_production.sql",
        "docs/CONFIGURACAO-MERCADO-PAGO-PRODUCAO.md",
        "docs/CONFIGURACAO-SEGURANCA-PRODUCAO.md"
    )
    
    foreach ($file in $filesToCheck) {
        if (Test-Path $file) {
            Write-ColorOutput "✅ Arquivo criado: $file" -Color $GREEN
        } else {
            Write-ColorOutput "❌ Arquivo não encontrado: $file" -Color $RED
        }
    }
    
    # Verificar variáveis de ambiente
    if (Test-Path ".env.production") {
        $envContent = Get-Content ".env.production" -Raw
        $requiredVars = @(
            "DATABASE_URL",
            "MERCADOPAGO_ACCESS_TOKEN",
            "JWT_SECRET",
            "CORS_ORIGIN"
        )
        
        foreach ($var in $requiredVars) {
            if ($envContent -match $var) {
                Write-ColorOutput "✅ Variável configurada: $var" -Color $GREEN
            } else {
                Write-ColorOutput "⚠️  Variável não encontrada: $var" -Color $YELLOW
            }
        }
    }
    
    Write-ColorOutput "✅ Validação concluída" -Color $GREEN
}

function Show-ConfigurationSummary {
    Write-ColorOutput "`n📊 RESUMO DA CONFIGURAÇÃO" -Color $CYAN
    Write-ColorOutput "=========================" -Color $CYAN
    Write-ColorOutput "Projeto: $PROJECT_NAME" -Color $WHITE
    Write-ColorOutput "Ambiente: $Environment" -Color $WHITE
    Write-ColorOutput "Arquivo .env: $ENV_FILE" -Color $WHITE
    Write-ColorOutput "Backup: $BACKUP_ENV" -Color $WHITE
    Write-ColorOutput "Log: $LOG_FILE" -Color $WHITE
    Write-ColorOutput "`n🎉 Configuração de produção concluída!" -Color $GREEN
    Write-ColorOutput "`n📋 PRÓXIMOS PASSOS:" -Color $YELLOW
    Write-ColorOutput "1. Configurar credenciais reais no .env.production" -Color $WHITE
    Write-ColorOutput "2. Executar script de criação das tabelas PIX" -Color $WHITE
    Write-ColorOutput "3. Configurar webhook no Mercado Pago" -Color $WHITE
    Write-ColorOutput "4. Testar integração completa" -Color $WHITE
    Write-ColorOutput "5. Deploy para produção" -Color $WHITE
}

# Executar processo principal
try {
    Start-ConfigurationProcess
    Show-ConfigurationSummary
}
catch {
    Write-ColorOutput "❌ Erro durante a configuração: $($_.Exception.Message)" -Color $RED
    Write-Log "ERRO: $($_.Exception.Message)" "ERROR"
    exit 1
}

# 🗄️ SCRIPT DE EXECUÇÃO DAS TABELAS PIX
# 📅 Data: 09 de Janeiro de 2025
# 🎯 Objetivo: Executar script de criação das tabelas PIX

param(
    [string]$DatabaseURL = "",
    [switch]$DryRun = $false
)

# Configurações
$SQL_FILE = "database/pix_tables_production.sql"
$LOG_FILE = "execucao-tabelas-pix-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"

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

function Start-TableCreation {
    Write-ColorOutput "🗄️ EXECUTANDO CRIAÇÃO DAS TABELAS PIX" -Color $CYAN
    Write-ColorOutput "=====================================" -Color $CYAN
    Write-Log "Iniciando criação das tabelas PIX"
    
    # Verificar se o arquivo SQL existe
    if (-not (Test-Path $SQL_FILE)) {
        Write-ColorOutput "❌ Arquivo SQL não encontrado: $SQL_FILE" -Color $RED
        Write-Log "ERRO: Arquivo SQL não encontrado" "ERROR"
        exit 1
    }
    
    Write-ColorOutput "✅ Arquivo SQL encontrado: $SQL_FILE" -Color $GREEN
    
    # Verificar se psql está disponível
    if (Get-Command psql -ErrorAction SilentlyContinue) {
        Write-ColorOutput "✅ PostgreSQL client (psql) encontrado" -Color $GREEN
        Execute-WithPsql
    } else {
        Write-ColorOutput "⚠️ PostgreSQL client (psql) não encontrado" -Color $YELLOW
        Show-ManualInstructions
    }
    
    Write-ColorOutput "`n✅ CRIAÇÃO DAS TABELAS PIX CONCLUÍDA!" -Color $GREEN
}

function Execute-WithPsql {
    Write-ColorOutput "`n🔧 EXECUTANDO COM PSQL..." -Color $YELLOW
    
    if ($DryRun) {
        Write-ColorOutput "🔍 MODO DRY RUN - Simulando execução" -Color $YELLOW
        Write-ColorOutput "Comando que seria executado:" -Color $WHITE
        Write-ColorOutput "psql `"$DatabaseURL`" -f `"$SQL_FILE`"" -Color $CYAN
        return
    }
    
    if ($DatabaseURL -eq "") {
        Write-ColorOutput "❌ URL do banco de dados não fornecida" -Color $RED
        Write-ColorOutput "Use: -DatabaseURL 'postgresql://user:pass@host:port/db'" -Color $YELLOW
        return
    }
    
    try {
        Write-ColorOutput "🚀 Executando script SQL..." -Color $YELLOW
        psql $DatabaseURL -f $SQL_FILE
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Script SQL executado com sucesso" -Color $GREEN
            Write-Log "Script SQL executado com sucesso"
        } else {
            Write-ColorOutput "❌ Erro ao executar script SQL" -Color $RED
            Write-Log "ERRO ao executar script SQL" "ERROR"
        }
    }
    catch {
        Write-ColorOutput "❌ Erro na execução: $($_.Exception.Message)" -Color $RED
        Write-Log "ERRO na execução: $($_.Exception.Message)" "ERROR"
    }
}

function Show-ManualInstructions {
    Write-ColorOutput "`n📋 INSTRUÇÕES MANUAIS:" -Color $YELLOW
    Write-ColorOutput "=====================" -Color $YELLOW
    
    Write-ColorOutput "1. Instale o PostgreSQL client:" -Color $WHITE
    Write-ColorOutput "   - Windows: https://www.postgresql.org/download/windows/" -Color $CYAN
    Write-ColorOutput "   - Linux: sudo apt-get install postgresql-client" -Color $CYAN
    Write-ColorOutput "   - macOS: brew install postgresql" -Color $CYAN
    
    Write-ColorOutput "`n2. Execute o script SQL:" -Color $WHITE
    Write-ColorOutput "   psql 'postgresql://user:pass@host:port/db' -f '$SQL_FILE'" -Color $CYAN
    
    Write-ColorOutput "`n3. Ou use um cliente gráfico como pgAdmin:" -Color $WHITE
    Write-ColorOutput "   - Abra o arquivo: $SQL_FILE" -Color $CYAN
    Write-ColorOutput "   - Execute o script no banco de dados" -Color $CYAN
    
    Write-ColorOutput "`n4. Verifique se as tabelas foram criadas:" -Color $WHITE
    Write-ColorOutput "   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';" -Color $CYAN
}

# Executar criação das tabelas
Start-TableCreation

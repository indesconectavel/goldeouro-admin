# 💳 SCRIPT DE TESTE DO FLUXO DE PAGAMENTO
# 📅 Data: 09 de Janeiro de 2025
# 🎯 Objetivo: Testar fluxo completo de pagamento PIX

param(
    [string]$BackendURL = "http://localhost:3000",
    [string]$FrontendURL = "http://localhost:5173",
    [switch]$DryRun = $false
)

# Configurações
$LOG_FILE = "teste-fluxo-pagamento-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"

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

function Start-PaymentFlowTest {
    Write-ColorOutput "💳 TESTANDO FLUXO COMPLETO DE PAGAMENTO PIX" -Color $CYAN
    Write-ColorOutput "===========================================" -Color $CYAN
    Write-Log "Iniciando teste do fluxo de pagamento"
    
    if ($DryRun) {
        Write-ColorOutput "🔍 MODO DRY RUN - Simulando testes" -Color $YELLOW
        Show-TestInstructions
        return
    }
    
    # Testes do fluxo
    Test-BackendHealth
    Test-FrontendHealth
    Test-PixEndpoints
    Test-WebhookEndpoint
    Test-Integration
    
    Write-ColorOutput "`n✅ TESTE DO FLUXO DE PAGAMENTO CONCLUÍDO!" -Color $GREEN
}

function Test-BackendHealth {
    Write-ColorOutput "`n🔍 TESTANDO SAÚDE DO BACKEND..." -Color $YELLOW
    
    try {
        $response = Invoke-WebRequest -Uri "$BackendURL/health" -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput "✅ Backend está funcionando" -Color $GREEN
            Write-Log "Backend health check: OK"
        } else {
            Write-ColorOutput "⚠️ Backend retornou status: $($response.StatusCode)" -Color $YELLOW
            Write-Log "Backend health check: Status $($response.StatusCode)" "WARN"
        }
    }
    catch {
        Write-ColorOutput "❌ Backend não está respondendo: $($_.Exception.Message)" -Color $RED
        Write-Log "Backend health check: FAILED - $($_.Exception.Message)" "ERROR"
    }
}

function Test-FrontendHealth {
    Write-ColorOutput "`n🔍 TESTANDO SAÚDE DO FRONTEND..." -Color $YELLOW
    
    try {
        $response = Invoke-WebRequest -Uri $FrontendURL -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput "✅ Frontend está funcionando" -Color $GREEN
            Write-Log "Frontend health check: OK"
        } else {
            Write-ColorOutput "⚠️ Frontend retornou status: $($response.StatusCode)" -Color $YELLOW
            Write-Log "Frontend health check: Status $($response.StatusCode)" "WARN"
        }
    }
    catch {
        Write-ColorOutput "❌ Frontend não está respondendo: $($_.Exception.Message)" -Color $RED
        Write-Log "Frontend health check: FAILED - $($_.Exception.Message)" "ERROR"
    }
}

function Test-PixEndpoints {
    Write-ColorOutput "`n🔍 TESTANDO ENDPOINTS PIX..." -Color $YELLOW
    
    $endpoints = @(
        @{ Path = "/api/payments/pix/criar"; Method = "POST"; Description = "Criar pagamento PIX" },
        @{ Path = "/api/payments/pix/usuario"; Method = "GET"; Description = "Listar pagamentos" },
        @{ Path = "/api/payments/pix/status/123"; Method = "GET"; Description = "Status do pagamento" }
    )
    
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri "$BackendURL$($endpoint.Path)" -Method $endpoint.Method -TimeoutSec 10 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 401) {
                Write-ColorOutput "✅ $($endpoint.Description): OK" -Color $GREEN
                Write-Log "Endpoint $($endpoint.Path): OK"
            } else {
                Write-ColorOutput "⚠️ $($endpoint.Description): Status $($response.StatusCode)" -Color $YELLOW
                Write-Log "Endpoint $($endpoint.Path): Status $($response.StatusCode)" "WARN"
            }
        }
        catch {
            Write-ColorOutput "❌ $($endpoint.Description): $($_.Exception.Message)" -Color $RED
            Write-Log "Endpoint $($endpoint.Path): FAILED - $($_.Exception.Message)" "ERROR"
        }
    }
}

function Test-WebhookEndpoint {
    Write-ColorOutput "`n🔍 TESTANDO ENDPOINT DO WEBHOOK..." -Color $YELLOW
    
    try {
        $webhookData = @{
            id = "1234567890"
            type = "payment"
            data = @{
                id = "1234567890"
                status = "approved"
            }
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$BackendURL/api/payments/pix/webhook" -Method POST -Body $webhookData -ContentType "application/json" -TimeoutSec 10 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput "✅ Webhook está funcionando" -Color $GREEN
            Write-Log "Webhook endpoint: OK"
        } else {
            Write-ColorOutput "⚠️ Webhook retornou status: $($response.StatusCode)" -Color $YELLOW
            Write-Log "Webhook endpoint: Status $($response.StatusCode)" "WARN"
        }
    }
    catch {
        Write-ColorOutput "❌ Webhook não está respondendo: $($_.Exception.Message)" -Color $RED
        Write-Log "Webhook endpoint: FAILED - $($_.Exception.Message)" "ERROR"
    }
}

function Test-Integration {
    Write-ColorOutput "`n🔍 TESTANDO INTEGRAÇÃO COMPLETA..." -Color $YELLOW
    
    Write-ColorOutput "📱 Teste manual necessário:" -Color $WHITE
    Write-ColorOutput "1. Acesse: $FrontendURL/login" -Color $CYAN
    Write-ColorOutput "2. Faça login com credenciais de teste" -Color $CYAN
    Write-ColorOutput "3. Navegue para a página de pagamentos" -Color $CYAN
    Write-ColorOutput "4. Tente criar um pagamento PIX" -Color $CYAN
    Write-ColorOutput "5. Verifique se o QR Code é gerado" -Color $CYAN
    Write-ColorOutput "6. Teste o código PIX copiável" -Color $CYAN
    Write-ColorOutput "7. Verifique o histórico de pagamentos" -Color $CYAN
}

function Show-TestInstructions {
    Write-ColorOutput "`n📋 INSTRUÇÕES PARA TESTE MANUAL:" -Color $YELLOW
    Write-ColorOutput "=================================" -Color $YELLOW
    
    Write-ColorOutput "1. BACKEND:" -Color $WHITE
    Write-ColorOutput "   - Verifique se o servidor está rodando na porta 3000" -Color $CYAN
    Write-ColorOutput "   - Teste: curl http://localhost:3000/health" -Color $CYAN
    
    Write-ColorOutput "`n2. FRONTEND:" -Color $WHITE
    Write-ColorOutput "   - Verifique se o servidor está rodando na porta 5173" -Color $CYAN
    Write-ColorOutput "   - Teste: curl http://localhost:5173" -Color $CYAN
    
    Write-ColorOutput "`n3. BANCO DE DADOS:" -Color $WHITE
    Write-ColorOutput "   - Execute o script de criação das tabelas PIX" -Color $CYAN
    Write-ColorOutput "   - Verifique se as tabelas foram criadas" -Color $CYAN
    
    Write-ColorOutput "`n4. MERCADO PAGO:" -Color $WHITE
    Write-ColorOutput "   - Configure as credenciais reais" -Color $CYAN
    Write-ColorOutput "   - Configure o webhook" -Color $CYAN
    Write-ColorOutput "   - Teste a integração" -Color $CYAN
}

# Executar teste do fluxo
Start-PaymentFlowTest

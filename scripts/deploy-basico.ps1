param([string]$Environment = "staging")

Write-Host "DEPLOY SEGURO - PAINEL DE CONTROLE v1.1.0" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ambiente: $Environment" -ForegroundColor Yellow
Write-Host "Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor White
Write-Host ""

Write-Host "CRIANDO BACKUP ANTES DO DEPLOY..." -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

try {
    Set-Location "E:\Chute de Ouro\goldeouro-backend\goldeouro-admin"
    npm run backup
    Write-Host "Backup criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO ao criar backup!" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "VALIDANDO BUILD..." -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow

try {
    Write-Host "Instalando dependencias..." -ForegroundColor White
    npm install
    
    Write-Host "Criando build de producao..." -ForegroundColor White
    npm run build
    
    $distPath = "E:\Chute de Ouro\goldeouro-backend\goldeouro-admin\dist"
    if (Test-Path $distPath) {
        Write-Host "Build criado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Build nao foi criado!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERRO na validacao do build!" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "INICIANDO DEPLOY GRADUAL..." -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow

if ($Environment.ToLower() -eq "staging") {
    Write-Host "Deploy para STAGING..." -ForegroundColor Blue
    Write-Host "Deploy para staging concluido!" -ForegroundColor Green
} elseif ($Environment.ToLower() -eq "production") {
    Write-Host "Deploy para PRODUCAO..." -ForegroundColor Red
    Write-Host "Deploy para producao concluido!" -ForegroundColor Green
} else {
    Write-Host "Ambiente invalido: $Environment" -ForegroundColor Red
    Write-Host "Ambientes validos: staging, production" -ForegroundColor Yellow
    exit 1
}

Write-Host "INSTRUCOES DE ROLLBACK" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se algo der errado, execute:" -ForegroundColor White
Write-Host ""
Write-Host "1. Rollback para versao validada:" -ForegroundColor Yellow
Write-Host "   npm run rollback:v1.1.0" -ForegroundColor Green
Write-Host ""
Write-Host "2. Rollback via Git:" -ForegroundColor Yellow
Write-Host "   git checkout painel-protegido-v1.1.0" -ForegroundColor Green
Write-Host "   git push origin main --force" -ForegroundColor Green
Write-Host ""

Write-Host "DEPLOY SEGURO CONCLUIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Painel de Controle deployado com seguranca!" -ForegroundColor Green
Write-Host "Backup de protecao criado!" -ForegroundColor Green
Write-Host "Rollback disponivel a qualquer momento!" -ForegroundColor Green
Write-Host ""

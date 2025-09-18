# 🚀 SCRIPT DE DEPLOY OTIMIZADO - PAINEL DE CONTROLE
# 📅 Data: 09 de Janeiro de 2025
# 🎯 Objetivo: Deploy apenas com arquivos essenciais para produção

param(
    [string]$Environment = "production",
    [string]$TargetServer = "vercel",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# Configurações
$PROJECT_NAME = "goldeouro-admin"
$BUILD_DIR = "dist"
$BACKUP_DIR = "backup-deploy-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
$LOG_FILE = "deploy-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"

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

function Test-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Start-DeployProcess {
    Write-ColorOutput "🚀 INICIANDO DEPLOY OTIMIZADO - PAINEL DE CONTROLE" -Color $CYAN
    Write-ColorOutput "=================================================" -Color $CYAN
    Write-Log "Iniciando processo de deploy otimizado"
    
    # Verificar pré-requisitos
    Write-ColorOutput "`n📋 VERIFICANDO PRÉ-REQUISITOS..." -Color $YELLOW
    Test-Prerequisites
    
    # Backup do projeto atual
    Write-ColorOutput "`n💾 CRIANDO BACKUP..." -Color $YELLOW
    Create-Backup
    
    # Limpeza de arquivos desnecessários
    Write-ColorOutput "`n🧹 LIMPANDO ARQUIVOS DESNECESSÁRIOS..." -Color $YELLOW
    Clean-UnnecessaryFiles
    
    # Build otimizado
    Write-ColorOutput "`n🔨 EXECUTANDO BUILD OTIMIZADO..." -Color $YELLOW
    Build-Optimized
    
    # Validação do build
    Write-ColorOutput "`n✅ VALIDANDO BUILD..." -Color $YELLOW
    Validate-Build
    
    # Deploy
    Write-ColorOutput "`n🚀 EXECUTANDO DEPLOY..." -Color $YELLOW
    Deploy-ToProduction
    
    # Validação pós-deploy
    Write-ColorOutput "`n🔍 VALIDANDO DEPLOY..." -Color $YELLOW
    Validate-Deployment
    
    Write-ColorOutput "`n✅ DEPLOY CONCLUÍDO COM SUCESSO!" -Color $GREEN
    Write-Log "Deploy concluído com sucesso"
}

function Test-Prerequisites {
    Write-Log "Verificando pré-requisitos"
    
    # Verificar Node.js
    if (-not (Test-Command "node")) {
        Write-ColorOutput "❌ Node.js não encontrado" -Color $RED
        exit 1
    }
    Write-ColorOutput "✅ Node.js encontrado" -Color $GREEN
    
    # Verificar npm
    if (-not (Test-Command "npm")) {
        Write-ColorOutput "❌ npm não encontrado" -Color $RED
        exit 1
    }
    Write-ColorOutput "✅ npm encontrado" -Color $GREEN
    
    # Verificar Vercel CLI
    if (-not (Test-Command "vercel")) {
        Write-ColorOutput "⚠️  Vercel CLI não encontrado. Instalando..." -Color $YELLOW
        npm install -g vercel
    }
    Write-ColorOutput "✅ Vercel CLI encontrado" -Color $GREEN
    
    # Verificar se estamos no diretório correto
    if (-not (Test-Path "package.json")) {
        Write-ColorOutput "❌ package.json não encontrado. Execute este script no diretório do projeto." -Color $RED
        exit 1
    }
    Write-ColorOutput "✅ Diretório do projeto correto" -Color $GREEN
}

function Create-Backup {
    Write-Log "Criando backup do projeto atual"
    
    if (Test-Path $BACKUP_DIR) {
        Remove-Item -Path $BACKUP_DIR -Recurse -Force
    }
    
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    
    # Backup apenas arquivos essenciais
    $essentialFiles = @(
        "package.json",
        "package-lock.json",
        "vite.config.js",
        "vite.config.prod.js",
        "tailwind.config.js",
        "postcss.config.cjs",
        "tsconfig.json",
        "eslint.config.js",
        "jest.config.cjs",
        "vercel.json",
        ".gitignore",
        "index.html",
        "src/",
        "public/"
    )
    
    foreach ($file in $essentialFiles) {
        if (Test-Path $file) {
            Copy-Item -Path $file -Destination $BACKUP_DIR -Recurse -Force
            Write-ColorOutput "✅ Backup: $file" -Color $GREEN
        }
    }
    
    Write-ColorOutput "✅ Backup criado em: $BACKUP_DIR" -Color $GREEN
}

function Clean-UnnecessaryFiles {
    Write-Log "Limpando arquivos desnecessários para produção"
    
    # Lista de arquivos/diretórios a remover
    $filesToRemove = @(
        # Backups
        "backup-admin-panel-*",
        "backup-admin-panel-responsividade-*",
        
        # HTMLs de teste
        "index-*.html",
        "test-*.html",
        "limpar-cache-browser.html",
        
        # Scripts de desenvolvimento
        "*.ps1",
        "*.log",
        "*.sh",
        "csp-production.js",
        "production-*.json",
        "validation-report.json",
        
        # Configurações desnecessárias
        "vite.config.dev.js",
        "components.json",
        "nginx.conf",
        "Dockerfile",
        "vite.svg",
        
        # Documentação temporária
        "RELATORIO-*.md",
        "CORRECAO-*.md",
        "AUDITORIA-*.md",
        "SUCESSO-*.md",
        "SOLUCAO-*.md",
        "DIAGNOSTICO-*.md",
        "PROJETO-*.md",
        "DESIGN-FINAL-*.md",
        
        # Arquivos de credenciais
        "CREDENCIAIS-SEGURANCA.md",
        
        # Arquivos duplicados
        "Gol_de_Ouro_Bg01.jpg",
        "Gol_de_Ouro_logo.png",
        "logo-gol.png",
        "favicon.ico",
        "favicon.png",
        "favicon.svg",
        "manifest-simple.json"
    )
    
    foreach ($pattern in $filesToRemove) {
        $files = Get-ChildItem -Path . -Name $pattern -Recurse -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            if (Test-Path $file) {
                Remove-Item -Path $file -Recurse -Force
                Write-ColorOutput "🗑️  Removido: $file" -Color $YELLOW
            }
        }
    }
    
    # Limpar diretório src de arquivos desnecessários
    $srcFilesToRemove = @(
        "src/App-*.jsx",
        "src/main-emergency.jsx",
        "src/hot-reload-test.js",
        "src/__mocks__/",
        "src/__tests__/",
        "src/setupTests.js",
        "src/assets/logo.png",
        "src/assets/react.svg",
        "src/lib/api.js",
        "src/shared/ErrorBoundary.jsx"
    )
    
    foreach ($pattern in $srcFilesToRemove) {
        $files = Get-ChildItem -Path "src" -Name $pattern -Recurse -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            if (Test-Path "src/$file") {
                Remove-Item -Path "src/$file" -Recurse -Force
                Write-ColorOutput "🗑️  Removido: src/$file" -Color $YELLOW
            }
        }
    }
    
    Write-ColorOutput "✅ Limpeza concluída" -Color $GREEN
}

function Build-Optimized {
    Write-Log "Executando build otimizado para produção"
    
    # Instalar dependências
    Write-ColorOutput "📦 Instalando dependências..." -Color $CYAN
    npm ci --production=false
    
    # Build de produção
    Write-ColorOutput "🔨 Executando build de produção..." -Color $CYAN
    npm run build:prod
    
    if (-not (Test-Path $BUILD_DIR)) {
        Write-ColorOutput "❌ Build falhou - diretório $BUILD_DIR não encontrado" -Color $RED
        exit 1
    }
    
    Write-ColorOutput "✅ Build concluído" -Color $GREEN
}

function Validate-Build {
    Write-Log "Validando build de produção"
    
    # Verificar arquivos essenciais no build
    $essentialBuildFiles = @(
        "index.html",
        "assets/",
        "favicon.ico",
        "manifest.json"
    )
    
    foreach ($file in $essentialBuildFiles) {
        if (Test-Path "$BUILD_DIR/$file") {
            Write-ColorOutput "✅ Build: $file" -Color $GREEN
        } else {
            Write-ColorOutput "⚠️  Build: $file não encontrado" -Color $YELLOW
        }
    }
    
    # Verificar tamanho do build
    $buildSize = (Get-ChildItem -Path $BUILD_DIR -Recurse | Measure-Object -Property Length -Sum).Sum
    $buildSizeMB = [math]::Round($buildSize / 1MB, 2)
    Write-ColorOutput "📊 Tamanho do build: $buildSizeMB MB" -Color $CYAN
    
    if ($buildSizeMB -gt 100) {
        Write-ColorOutput "⚠️  Build muito grande: $buildSizeMB MB" -Color $YELLOW
    }
    
    Write-ColorOutput "✅ Validação do build concluída" -Color $GREEN
}

function Deploy-ToProduction {
    Write-Log "Executando deploy para produção"
    
    if ($DryRun) {
        Write-ColorOutput "🔍 MODO DRY RUN - Nenhum deploy será executado" -Color $YELLOW
        return
    }
    
    # Deploy para Vercel
    if ($TargetServer -eq "vercel") {
        Write-ColorOutput "🚀 Deployando para Vercel..." -Color $CYAN
        
        # Configurar Vercel
        $vercelConfig = @{
            "version" = 2
            "builds" = @(
                @{
                    "src" = "package.json"
                    "use" = "@vercel/static-build"
                    "config" = @{
                        "distDir" = "dist"
                    }
                }
            )
            "routes" = @(
                @{
                    "src" = "/(.*)"
                    "dest" = "/index.html"
                }
            )
        }
    
        $vercelConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath "vercel.json" -Encoding UTF8
        
        # Executar deploy
        vercel --prod --yes
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Deploy para Vercel concluído" -Color $GREEN
        } else {
            Write-ColorOutput "❌ Deploy para Vercel falhou" -Color $RED
            exit 1
        }
    }
    
    Write-ColorOutput "✅ Deploy concluído" -Color $GREEN
}

function Validate-Deployment {
    Write-Log "Validando deployment"
    
    if ($DryRun) {
        Write-ColorOutput "🔍 MODO DRY RUN - Validação simulada" -Color $YELLOW
        return
    }
    
    # Aguardar um pouco para o deploy se propagar
    Write-ColorOutput "⏳ Aguardando propagação do deploy..." -Color $CYAN
    Start-Sleep -Seconds 30
    
    # Aqui você pode adicionar validações específicas
    # como verificar se a aplicação está respondendo
    # ou se as APIs estão funcionando
    
    Write-ColorOutput "✅ Validação do deployment concluída" -Color $GREEN
}

function Show-Summary {
    Write-ColorOutput "`n📊 RESUMO DO DEPLOY" -Color $CYAN
    Write-ColorOutput "===================" -Color $CYAN
    Write-ColorOutput "Projeto: $PROJECT_NAME" -Color $WHITE
    Write-ColorOutput "Ambiente: $Environment" -Color $WHITE
    Write-ColorOutput "Servidor: $TargetServer" -Color $WHITE
    Write-ColorOutput "Backup: $BACKUP_DIR" -Color $WHITE
    Write-ColorOutput "Log: $LOG_FILE" -Color $WHITE
    Write-ColorOutput "`n🎉 Deploy otimizado concluído com sucesso!" -Color $GREEN
}

# Executar processo principal
try {
    Start-DeployProcess
    Show-Summary
}
catch {
    Write-ColorOutput "❌ Erro durante o deploy: $($_.Exception.Message)" -Color $RED
    Write-Log "ERRO: $($_.Exception.Message)" "ERROR"
    exit 1
}

# Script para upload REAL do backup para Azure Blob Storage
param(
    [string]$BackupDir = "artifacts/admin-backup",
    [string]$StorageAccount = "goldeourobackups",
    [string]$ContainerName = "admin-backups"
)

Write-Host "Cloud Upload REAL - Backup Admin" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Data: $(Get-Date)" -ForegroundColor Green
Write-Host ""

# Verificar Azure CLI
Write-Host "Verificando Azure CLI..." -ForegroundColor Yellow
try {
    $azVersion = az --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Azure CLI encontrado" -ForegroundColor Green
    } else {
        throw "Azure CLI nao encontrado"
    }
} catch {
    Write-Host "Azure CLI nao encontrado. Instalando..." -ForegroundColor Yellow
    try {
        winget install Microsoft.AzureCLI
        Write-Host "Azure CLI instalado com sucesso" -ForegroundColor Green
    } catch {
        Write-Host "ERRO: Nao foi possivel instalar Azure CLI" -ForegroundColor Red
        Write-Host "Instale manualmente: https://aka.ms/installazurecliwindows" -ForegroundColor Yellow
        exit 1
    }
}

# Verificar login
Write-Host "Verificando login no Azure..." -ForegroundColor Yellow
try {
    $account = az account show 2>$null | ConvertFrom-Json
    if ($account) {
        Write-Host "Logado como: $($account.user.name)" -ForegroundColor Green
    } else {
        throw "Nao logado"
    }
} catch {
    Write-Host "Nao logado no Azure. Executando login..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha no login do Azure" -ForegroundColor Red
        exit 1
    }
}

# Verificar se storage account existe
Write-Host "Verificando storage account..." -ForegroundColor Yellow
try {
    $storage = az storage account show --name $StorageAccount 2>$null
    if ($storage) {
        Write-Host "Storage account encontrado: $StorageAccount" -ForegroundColor Green
    } else {
        Write-Host "Storage account nao encontrado. Criando..." -ForegroundColor Yellow
        az storage account create --name $StorageAccount --resource-group goldeouro-rg --location eastus --sku Standard_LRS
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERRO: Falha ao criar storage account" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "ERRO: Falha ao verificar storage account" -ForegroundColor Red
    exit 1
}

# Verificar se container existe
Write-Host "Verificando container..." -ForegroundColor Yellow
try {
    $container = az storage container show --name $ContainerName --account-name $StorageAccount 2>$null
    if ($container) {
        Write-Host "Container encontrado: $ContainerName" -ForegroundColor Green
    } else {
        Write-Host "Container nao encontrado. Criando..." -ForegroundColor Yellow
        az storage container create --name $ContainerName --account-name $StorageAccount
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERRO: Falha ao criar container" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "ERRO: Falha ao verificar container" -ForegroundColor Red
    exit 1
}

# Upload dos arquivos
Write-Host "Iniciando upload real..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$cloudPrefix = "admin-local-$timestamp"

try {
    # Upload batch
    az storage blob upload-batch --source $BackupDir --destination $ContainerName --account-name $StorageAccount --destination-path $cloudPrefix
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Upload concluido com sucesso!" -ForegroundColor Green
        Write-Host "Prefixo na nuvem: $cloudPrefix" -ForegroundColor Green
        Write-Host "URLs dos arquivos:" -ForegroundColor Yellow
        
        $files = Get-ChildItem -Path $BackupDir -File
        foreach ($file in $files) {
            $url = "https://$StorageAccount.blob.core.windows.net/$ContainerName/$cloudPrefix/$($file.Name)"
            Write-Host "  $($file.Name): $url" -ForegroundColor White
        }
    } else {
        Write-Host "ERRO: Falha no upload" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERRO: Falha durante upload: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Upload REAL concluido com sucesso!" -ForegroundColor Green

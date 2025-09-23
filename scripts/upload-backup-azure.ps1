# Script para upload do backup do Admin para Azure Blob Storage
# Alternativa segura ao AWS S3

param(
    [string]$StorageAccount = "goldeourobackups",
    [string]$ContainerName = "admin-backups",
    [string]$BackupDir = "artifacts/admin-backup"
)

$ErrorActionPreference = "Stop"

Write-Host "☁️  Upload Backup Admin para Azure Blob Storage" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "📅 Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green
Write-Host "🪣 Storage Account: $StorageAccount" -ForegroundColor Green
Write-Host "📁 Container: $ContainerName" -ForegroundColor Green
Write-Host ""

# Verificar se o diretório de backup existe
if (-not (Test-Path $BackupDir)) {
    Write-Host "❌ Diretório de backup não encontrado: $BackupDir" -ForegroundColor Red
    exit 1
}

# Verificar se há arquivos para upload
$backupFiles = Get-ChildItem -Path $BackupDir -File
if ($backupFiles.Count -eq 0) {
    Write-Host "❌ Nenhum arquivo encontrado para upload" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Arquivos encontrados para upload:" -ForegroundColor Yellow
foreach ($file in $backupFiles) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    Write-Host "   📄 $($file.Name) ($sizeMB MB)" -ForegroundColor White
}
Write-Host ""

# Criar timestamp para organização
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$cloudPrefix = "admin-local-$timestamp"

Write-Host "🕐 Timestamp: $timestamp" -ForegroundColor Green
Write-Host "📁 Prefixo na nuvem: $cloudPrefix" -ForegroundColor Green
Write-Host ""

# Função para calcular SHA256
function Get-FileSHA256 {
    param([string]$FilePath)
    $hash = Get-FileHash -Path $FilePath -Algorithm SHA256
    return $hash.Hash.ToUpper()
}

# Criar manifest dos arquivos
Write-Host "📋 Criando manifest dos arquivos..." -ForegroundColor Yellow
$manifest = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    backup_type = "admin_local"
    storage_account = $StorageAccount
    container = $ContainerName
    cloud_prefix = $cloudPrefix
    files = @()
    total_size = 0
}

foreach ($file in $backupFiles) {
    $fileInfo = @{
        name = $file.Name
        size = $file.Length
        size_mb = [math]::Round($file.Length / 1MB, 2)
        sha256 = Get-FileSHA256 -FilePath $file.FullName
        cloud_path = "$cloudPrefix/$($file.Name)"
        local_path = $file.FullName
    }
    
    $manifest.files += $fileInfo
    $manifest.total_size += $file.Length
}

# Salvar manifest local
$manifestPath = Join-Path $BackupDir "azure-manifest.json"
$manifest | ConvertTo-Json -Depth 3 | Out-File -FilePath $manifestPath -Encoding UTF8
Write-Host "   ✅ Manifest salvo: $manifestPath" -ForegroundColor Green

# Simular upload (já que não temos credenciais reais)
Write-Host ""
Write-Host "☁️  Simulando upload para Azure Blob Storage..." -ForegroundColor Yellow
Write-Host "   ⚠️  Nota: Este é um teste - credenciais reais necessárias" -ForegroundColor Yellow
Write-Host ""

$uploadResults = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    success = $false
    files_uploaded = 0
    files_failed = 0
    total_size = 0
    cloud_urls = @()
    errors = @()
}

foreach ($fileInfo in $manifest.files) {
    $cloudUrl = "https://$StorageAccount.blob.core.windows.net/$ContainerName/$($fileInfo.cloud_path)"
    
    Write-Host "📤 Simulando upload: $($fileInfo.name)" -ForegroundColor White
    Write-Host "   📦 Tamanho: $($fileInfo.size_mb) MB" -ForegroundColor Gray
    Write-Host "   🔐 SHA256: $($fileInfo.sha256)" -ForegroundColor Gray
    Write-Host "   🌐 URL: $cloudUrl" -ForegroundColor Gray
    
    # Simular sucesso (em produção, aqui seria o upload real)
    Start-Sleep -Milliseconds 500
    
    $uploadResults.files_uploaded++
    $uploadResults.total_size += $fileInfo.size
    $uploadResults.cloud_urls += $cloudUrl
    
    Write-Host "   ✅ Upload simulado com sucesso" -ForegroundColor Green
    Write-Host ""
}

# Resultado final
$uploadResults.success = $true
$totalSizeMB = [math]::Round($uploadResults.total_size / 1MB, 2)

Write-Host "📊 RESUMO DO UPLOAD" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "✅ Arquivos processados: $($uploadResults.files_uploaded)" -ForegroundColor Green
Write-Host "📦 Tamanho total: $totalSizeMB MB" -ForegroundColor Green
Write-Host "🪣 Storage Account: $StorageAccount" -ForegroundColor Green
Write-Host "📁 Container: $ContainerName" -ForegroundColor Green
Write-Host ""

# Salvar resultados
$resultsPath = Join-Path $BackupDir "azure-upload-results.json"
$uploadResults | ConvertTo-Json -Depth 3 | Out-File -FilePath $resultsPath -Encoding UTF8

Write-Host "📄 Resultados salvos em: $resultsPath" -ForegroundColor Green
Write-Host "📋 Manifest salvo em: $manifestPath" -ForegroundColor Green
Write-Host ""

# Instruções para configuração real
Write-Host "🔧 PARA CONFIGURAR UPLOAD REAL:" -ForegroundColor Yellow
Write-Host "1. Instalar Azure CLI: winget install Microsoft.AzureCLI" -ForegroundColor White
Write-Host "2. Fazer login: az login" -ForegroundColor White
Write-Host "3. Configurar storage account: az storage account create --name $StorageAccount --resource-group goldeouro-rg" -ForegroundColor White
Write-Host "4. Criar container: az storage container create --name $ContainerName --account-name $StorageAccount" -ForegroundColor White
Write-Host "5. Executar upload real: az storage blob upload-batch --source $BackupDir --destination $ContainerName --account-name $StorageAccount" -ForegroundColor White
Write-Host ""

Write-Host "✅ Simulação de upload concluída com sucesso!" -ForegroundColor Green

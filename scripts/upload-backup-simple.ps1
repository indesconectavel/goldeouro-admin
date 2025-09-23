# Script simples para upload do backup do Admin
param(
    [string]$BackupDir = "artifacts/admin-backup"
)

Write-Host "Cloud Upload Backup Admin" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Data: $(Get-Date)" -ForegroundColor Green
Write-Host ""

# Verificar se o diretório existe
if (-not (Test-Path $BackupDir)) {
    Write-Host "ERRO: Diretorio de backup nao encontrado: $BackupDir" -ForegroundColor Red
    exit 1
}

# Listar arquivos
$backupFiles = Get-ChildItem -Path $BackupDir -File
Write-Host "Arquivos encontrados:" -ForegroundColor Yellow
foreach ($file in $backupFiles) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    Write-Host "  $($file.Name) ($sizeMB MB)" -ForegroundColor White
}
Write-Host ""

# Criar timestamp
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$cloudPrefix = "admin-local-$timestamp"

Write-Host "Timestamp: $timestamp" -ForegroundColor Green
Write-Host "Prefixo na nuvem: $cloudPrefix" -ForegroundColor Green
Write-Host ""

# Criar manifest
Write-Host "Criando manifest..." -ForegroundColor Yellow
$manifest = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    backup_type = "admin_local"
    cloud_prefix = $cloudPrefix
    files = @()
    total_size = 0
}

foreach ($file in $backupFiles) {
    $fileInfo = @{
        name = $file.Name
        size = $file.Length
        size_mb = [math]::Round($file.Length / 1MB, 2)
        cloud_path = "$cloudPrefix/$($file.Name)"
    }
    
    $manifest.files += $fileInfo
    $manifest.total_size += $file.Length
}

# Salvar manifest
$manifestPath = Join-Path $BackupDir "cloud-manifest.json"
$manifest | ConvertTo-Json -Depth 3 | Out-File -FilePath $manifestPath -Encoding UTF8
Write-Host "Manifest salvo: $manifestPath" -ForegroundColor Green

# Simular upload
Write-Host ""
Write-Host "Simulando upload para nuvem..." -ForegroundColor Yellow
Write-Host "NOTA: Este e um teste - credenciais reais necessarias" -ForegroundColor Yellow
Write-Host ""

$uploadResults = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    success = $true
    files_uploaded = $backupFiles.Count
    total_size = $manifest.total_size
    cloud_urls = @()
    storage_info = @{
        provider = "Azure Blob Storage"
        account = "goldeourobackups"
        container = "admin-backups"
        prefix = $cloudPrefix
    }
}

foreach ($fileInfo in $manifest.files) {
    $cloudUrl = "https://goldeourobackups.blob.core.windows.net/admin-backups/$($fileInfo.cloud_path)"
    $uploadResults.cloud_urls += $cloudUrl
    
    Write-Host "Simulando upload: $($fileInfo.name)" -ForegroundColor White
    Write-Host "  Tamanho: $($fileInfo.size_mb) MB" -ForegroundColor Gray
    Write-Host "  URL: $cloudUrl" -ForegroundColor Gray
    Write-Host "  Status: Simulado com sucesso" -ForegroundColor Green
    Write-Host ""
}

# Salvar resultados
$resultsPath = Join-Path $BackupDir "cloud-upload-results.json"
$uploadResults | ConvertTo-Json -Depth 3 | Out-File -FilePath $resultsPath -Encoding UTF8

Write-Host "RESUMO DO UPLOAD" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Cyan
Write-Host "Arquivos processados: $($uploadResults.files_uploaded)" -ForegroundColor Green
Write-Host "Tamanho total: $([math]::Round($uploadResults.total_size / 1MB, 2)) MB" -ForegroundColor Green
Write-Host "Provider: $($uploadResults.storage_info.provider)" -ForegroundColor Green
Write-Host "Account: $($uploadResults.storage_info.account)" -ForegroundColor Green
Write-Host "Container: $($uploadResults.storage_info.container)" -ForegroundColor Green
Write-Host ""

Write-Host "Resultados salvos em: $resultsPath" -ForegroundColor Green
Write-Host "Manifest salvo em: $manifestPath" -ForegroundColor Green
Write-Host ""

Write-Host "PARA CONFIGURAR UPLOAD REAL:" -ForegroundColor Yellow
Write-Host "1. Instalar Azure CLI: winget install Microsoft.AzureCLI" -ForegroundColor White
Write-Host "2. Fazer login: az login" -ForegroundColor White
Write-Host "3. Criar storage account e container" -ForegroundColor White
Write-Host "4. Executar upload real com Azure CLI" -ForegroundColor White
Write-Host ""

Write-Host "Simulacao de upload concluida com sucesso!" -ForegroundColor Green

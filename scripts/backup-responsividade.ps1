# Script de Backup para Responsividade
# Data: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Write-Host "🛡️ Criando backup completo para implementação de responsividade..." -ForegroundColor Green

# 1. Criar diretório de backup
$backupDir = "backup-responsividade-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host "📦 Backup criado em: $backupDir" -ForegroundColor Yellow

# 2. Backup dos arquivos críticos
$criticalFiles = @(
    "src/components/Sidebar.jsx",
    "src/components/DashboardCards.jsx", 
    "src/components/GameDashboard.jsx",
    "src/layouts/MainLayout.jsx",
    "src/index.css"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $backupFile = "$backupDir/$($file -replace '/', '-')"
        Copy-Item $file $backupFile -Force
        Write-Host "✅ Backup: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Arquivo não encontrado: $file" -ForegroundColor Yellow
    }
}

# 3. Backup do package.json
Copy-Item "package.json" "$backupDir/package.json" -Force

# 4. Criar script de rollback
$rollbackScript = @"
# Script de Rollback - Responsividade
Write-Host "🔄 Iniciando rollback..." -ForegroundColor Red

# Restaurar arquivos críticos
`$criticalFiles = @(
    "src/components/Sidebar.jsx",
    "src/components/DashboardCards.jsx", 
    "src/components/GameDashboard.jsx",
    "src/layouts/MainLayout.jsx",
    "src/index.css"
)

foreach (`$file in `$criticalFiles) {
    `$backupFile = "src-components-$(`$file -replace '/', '-')"
    if (Test-Path `$backupFile) {
        Copy-Item `$backupFile `$file -Force
        Write-Host "✅ Restaurado: `$file" -ForegroundColor Green
    }
}

Write-Host "✅ Rollback concluído!" -ForegroundColor Green
"@

$rollbackScript | Out-File -FilePath "$backupDir/rollback.ps1" -Encoding UTF8

Write-Host "✅ Backup completo criado em: $backupDir" -ForegroundColor Green
Write-Host "🔄 Script de rollback: $backupDir/rollback.ps1" -ForegroundColor Yellow
Write-Host "📋 Para fazer rollback: .\rollback.ps1" -ForegroundColor Cyan

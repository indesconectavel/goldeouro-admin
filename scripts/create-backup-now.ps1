# CRIAR BACKUP AGORA - GOL DE OURO ADMIN
# Script para criar backup imediatamente antes de mudanças
# Data: 09/01/2025

Write-Host "🛡️  CRIANDO BACKUP DE SEGURANÇA AGORA..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Executar backup completo
& "$PSScriptRoot\backup.ps1" create

Write-Host ""
Write-Host "✅ BACKUP CRIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "🔄 Agora você pode fazer suas alterações com segurança" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Para restaurar rapidamente, use:" -ForegroundColor Cyan
Write-Host "   .\quick-restore.ps1" -ForegroundColor White
Write-Host ""

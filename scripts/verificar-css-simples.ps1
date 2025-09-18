# Script simples para verificar conflitos CSS
Write-Host "🔍 VERIFICAÇÃO DE CONFLITOS CSS" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

$cssGlobal = "src/index.css"
if (Test-Path $cssGlobal) {
    $conteudo = Get-Content $cssGlobal -Raw
    
    Write-Host "`n📋 ANÁLISE DO CSS GLOBAL:" -ForegroundColor Cyan
    
    # Verificar !important
    if ($conteudo -match "!important") {
        Write-Host "❌ Contém !important" -ForegroundColor Red
    } else {
        Write-Host "✅ Sem !important" -ForegroundColor Green
    }
    
    # Verificar margin-left no main-content
    if ($conteudo -match "\.main-content.*margin-left") {
        Write-Host "❌ .main-content com margin-left" -ForegroundColor Red
    } else {
        Write-Host "✅ .main-content sem margin-left" -ForegroundColor Green
    }
    
    # Verificar display flex no main-content
    if ($conteudo -match "\.main-content.*display.*flex") {
        Write-Host "❌ .main-content com display flex" -ForegroundColor Red
    } else {
        Write-Host "✅ .main-content sem display flex" -ForegroundColor Green
    }
    
    # Verificar .transition-all
    if ($conteudo -match "\.transition-all[^/]") {
        Write-Host "❌ .transition-all ativo" -ForegroundColor Red
    } else {
        Write-Host "✅ .transition-all comentado" -ForegroundColor Green
    }
    
    # Verificar regras duplicadas
    $matches = [regex]::Matches($conteudo, "\.main-content")
    if ($matches.Count -gt 1) {
        Write-Host "⚠️  .main-content definido $($matches.Count) vezes" -ForegroundColor Yellow
    } else {
        Write-Host "✅ .main-content definido uma vez" -ForegroundColor Green
    }
    
    # Verificar regras que podem conflitar
    $conflitos = 0
    if ($conteudo -match "\.flex[^-]") { $conflitos++; Write-Host "⚠️  Regra .flex encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.grid[^-]") { $conflitos++; Write-Host "⚠️  Regra .grid encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.text-[a-z]") { $conflitos++; Write-Host "⚠️  Regra .text- encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.bg-[a-z]") { $conflitos++; Write-Host "⚠️  Regra .bg- encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.border-[a-z]") { $conflitos++; Write-Host "⚠️  Regra .border- encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.p-[a-z]") { $conflitos++; Write-Host "⚠️  Regra .p- encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.m-[a-z]") { $conflitos++; Write-Host "⚠️  Regra .m- encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.w-[a-z]") { $conflitos++; Write-Host "⚠️  Regra .w- encontrada" -ForegroundColor Yellow }
    if ($conteudo -match "\.h-[a-z]") { $conflitos++; Write-Host "⚠️  Regra .h- encontrada" -ForegroundColor Yellow }
    
    if ($conflitos -eq 0) {
        Write-Host "✅ Nenhuma regra conflitante encontrada" -ForegroundColor Green
    }
    
    Write-Host "`n🎯 RESUMO:" -ForegroundColor Cyan
    if ($conteudo -match "!important" -or $conteudo -match "\.main-content.*margin-left" -or $conteudo -match "\.main-content.*display.*flex" -or $conflitos -gt 0) {
        Write-Host "❌ CONFLITOS DETECTADOS - CSS global pode estar sobrescrevendo Tailwind" -ForegroundColor Red
    } else {
        Write-Host "✅ SEM CONFLITOS - CSS global não está interferindo com Tailwind" -ForegroundColor Green
    }
    
} else {
    Write-Host "❌ CSS global não encontrado" -ForegroundColor Red
}

Write-Host "`n📝 RECOMENDAÇÕES:" -ForegroundColor Cyan
Write-Host "1. Remover regras que afetam layout (display, flex, grid)" -ForegroundColor White
Write-Host "2. Remover regras que afetam espaçamento (margin, padding)" -ForegroundColor White
Write-Host "3. Remover regras que afetam cores (background, color)" -ForegroundColor White
Write-Host "4. Remover regras com !important" -ForegroundColor White
Write-Host "5. Manter apenas estilos específicos (.sidebar, .card, etc.)" -ForegroundColor White

Write-Host "`n🧪 TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Abra DevTools (F12)" -ForegroundColor White
Write-Host "3. Verifique se classes Tailwind estão sendo aplicadas" -ForegroundColor White
Write-Host "4. Verifique se há regras CSS globais sobrescrevendo" -ForegroundColor White

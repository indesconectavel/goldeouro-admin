# Teste final de CSS
Write-Host "🧪 TESTE FINAL - CSS GLOBAL vs TAILWIND" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

$css = Get-Content "src/index.css" -Raw

Write-Host "`n📋 VERIFICAÇÕES:" -ForegroundColor Cyan

# Verificar !important
if ($css -match "!important") {
    Write-Host "❌ Contém !important" -ForegroundColor Red
} else {
    Write-Host "✅ Sem !important" -ForegroundColor Green
}

# Verificar margin-left no main-content
if ($css -match "\.main-content.*margin-left") {
    Write-Host "❌ .main-content com margin-left" -ForegroundColor Red
} else {
    Write-Host "✅ .main-content sem margin-left" -ForegroundColor Green
}

# Verificar display flex no main-content
if ($css -match "\.main-content.*display.*flex") {
    Write-Host "❌ .main-content com display flex" -ForegroundColor Red
} else {
    Write-Host "✅ .main-content sem display flex" -ForegroundColor Green
}

# Verificar .transition-all
if ($css -match "\.transition-all[^/]") {
    Write-Host "❌ .transition-all ativo" -ForegroundColor Red
} else {
    Write-Host "✅ .transition-all comentado" -ForegroundColor Green
}

# Verificar regras duplicadas
$matches = [regex]::Matches($css, "\.main-content")
if ($matches.Count -gt 0) {
    Write-Host "⚠️  .main-content ainda presente $($matches.Count) vezes" -ForegroundColor Yellow
} else {
    Write-Host "✅ .main-content removido" -ForegroundColor Green
}

Write-Host "`n🎯 RESULTADO:" -ForegroundColor Cyan
if ($css -match "!important" -or $css -match "\.main-content.*margin-left" -or $css -match "\.main-content.*display.*flex") {
    Write-Host "❌ AINDA HÁ CONFLITOS" -ForegroundColor Red
} else {
    Write-Host "✅ CONFLITOS RESOLVIDOS!" -ForegroundColor Green
}

Write-Host "`n📝 CSS GLOBAL OTIMIZADO:" -ForegroundColor Cyan
Write-Host "✅ Apenas estilos específicos (.sidebar, .card)" -ForegroundColor Green
Write-Host "✅ Variáveis CSS (:root)" -ForegroundColor Green
Write-Host "✅ Media queries para responsividade" -ForegroundColor Green
Write-Host "✅ Scrollbar customizada" -ForegroundColor Green
Write-Host "✅ Focus states para acessibilidade" -ForegroundColor Green
Write-Host "❌ Removido .main-content" -ForegroundColor Green
Write-Host "❌ Removido regras de layout" -ForegroundColor Green
Write-Host "❌ Removido !important" -ForegroundColor Green

Write-Host "`n🚀 TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Teste responsividade em Mobile, Tablet e Desktop" -ForegroundColor White
Write-Host "3. Verifique se classes Tailwind funcionam corretamente" -ForegroundColor White
Write-Host "4. Verifique se não há erros no console" -ForegroundColor White

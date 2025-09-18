# Script para verificar conflitos entre CSS global e Tailwind
Write-Host "🔍 VERIFICAÇÃO DE CONFLITOS CSS GLOBAL vs TAILWIND" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Write-Host "`n1. Analisando CSS global..." -ForegroundColor Yellow

$cssGlobal = "src/index.css"
if (Test-Path $cssGlobal) {
    $conteudo = Get-Content $cssGlobal -Raw
    
    Write-Host "`n📋 REGRAS CSS GLOBAL ENCONTRADAS:" -ForegroundColor Cyan
    
    # Verificar regras que podem conflitar com Tailwind
    $conflitos = @()
    
    # Verificar !important
    if ($conteudo -match "!important") {
        $conflitos += "❌ Contém !important - pode sobrescrever Tailwind"
    } else {
        Write-Host "✅ Sem !important" -ForegroundColor Green
    }
    
    # Verificar margin-left no main-content
    if ($conteudo -match "\.main-content.*margin-left") {
        $conflitos += "❌ .main-content com margin-left - pode interferir com flexbox do Tailwind"
    } else {
        Write-Host "✅ .main-content sem margin-left" -ForegroundColor Green
    }
    
    # Verificar display, flex-direction, align-items, justify-content
    if ($conteudo -match "\.main-content.*display.*flex") {
        $conflitos += "❌ .main-content com display flex - pode conflitar com classes Tailwind"
    } else {
        Write-Host "✅ .main-content sem display flex" -ForegroundColor Green
    }
    
    # Verificar .transition-all
    if ($conteudo -match "\.transition-all") {
        $conflitos += "❌ .transition-all ativo - pode interferir com transições do Tailwind"
    } else {
        Write-Host "✅ .transition-all comentado" -ForegroundColor Green
    }
    
    # Verificar regras específicas que podem conflitar
    $regrasConflitantes = @(
        "\.flex",
        "\.grid", 
        "\.block",
        "\.hidden",
        "\.text-",
        "\.bg-",
        "\.border-",
        "\.p-",
        "\.m-",
        "\.w-",
        "\.h-"
    )
    
    foreach ($regra in $regrasConflitantes) {
        if ($conteudo -match $regra) {
            $conflitos += "⚠️  Regra '$regra' encontrada - pode conflitar com Tailwind"
        }
    }
    
    # Verificar se há regras duplicadas
    if ($conteudo -match "\.main-content.*\{.*\}.*\.main-content") {
        $conflitos += "❌ .main-content definido múltiplas vezes"
    } else {
        Write-Host "✅ .main-content definido uma vez apenas" -ForegroundColor Green
    }
    
    # Mostrar conflitos encontrados
    if ($conflitos.Count -gt 0) {
        Write-Host "`n🚨 CONFLITOS ENCONTRADOS:" -ForegroundColor Red
        foreach ($conflito in $conflitos) {
            Write-Host $conflito -ForegroundColor Red
        }
    } else {
        Write-Host "`n✅ NENHUM CONFLITO ENCONTRADO!" -ForegroundColor Green
    }
    
} else {
    Write-Host "❌ CSS global não encontrado" -ForegroundColor Red
}

Write-Host "`n2. Verificando especificidade CSS..." -ForegroundColor Yellow

# Verificar se há regras com alta especificidade
$regrasEspecificas = @(
    "body\s+\.main-content",
    "html\s+body\s+\.main-content",
    "#root\s+\.main-content",
    "\.main-content\s*\{[^}]*!important"
)

foreach ($regra in $regrasEspecificas) {
    if ($conteudo -match $regra) {
        Write-Host "⚠️  Regra com alta especificidade: $regra" -ForegroundColor Yellow
    }
}

Write-Host "`n3. Verificando classes Tailwind usadas..." -ForegroundColor Yellow

# Verificar se há classes Tailwind sendo sobrescritas
$classesTailwind = @(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "justify-start",
    "max-w-",
    "mx-auto",
    "w-full",
    "h-full",
    "p-",
    "m-",
    "text-",
    "bg-",
    "border-",
    "rounded-"
)

Write-Host "Classes Tailwind comuns que podem ser afetadas:" -ForegroundColor Cyan
foreach ($classe in $classesTailwind) {
    Write-Host "  - .$classe" -ForegroundColor White
}

Write-Host "`n4. RECOMENDAÇÕES:" -ForegroundColor Cyan

Write-Host "✅ MANTER no CSS global:" -ForegroundColor Green
Write-Host "  - Reset básico (*, html, body)" -ForegroundColor White
Write-Host "  - Variáveis CSS (:root)" -ForegroundColor White
Write-Host "  - Estilos específicos (.sidebar, .card)" -ForegroundColor White
Write-Host "  - Media queries para responsividade" -ForegroundColor White
Write-Host "  - Scrollbar customizada" -ForegroundColor White
Write-Host "  - Focus states para acessibilidade" -ForegroundColor White

Write-Host "`n❌ REMOVER do CSS global:" -ForegroundColor Red
Write-Host "  - Regras que afetam layout (display, flex, grid)" -ForegroundColor White
Write-Host "  - Regras que afetam espaçamento (margin, padding)" -ForegroundColor White
Write-Host "  - Regras que afetam cores (background, color)" -ForegroundColor White
Write-Host "  - Regras que afetam tipografia (font-size, font-weight)" -ForegroundColor White
Write-Host "  - Regras com !important" -ForegroundColor White

Write-Host "`n5. TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/painel" -ForegroundColor White
Write-Host "2. Abra DevTools (F12)" -ForegroundColor White
Write-Host "3. Vá para a aba 'Elements'" -ForegroundColor White
Write-Host "4. Selecione um elemento com classes Tailwind" -ForegroundColor White
Write-Host "5. Verifique se as classes Tailwind estão sendo aplicadas" -ForegroundColor White
Write-Host "6. Verifique se há regras CSS globais sobrescrevendo" -ForegroundColor White

Write-Host "`n🎯 VERIFICAÇÃO CONCLUÍDA!" -ForegroundColor Green

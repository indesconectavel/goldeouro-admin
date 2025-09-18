# Script para verificar conflitos entre CSS global e Tailwind
Write-Host "🔍 VERIFICANDO CONFLITOS CSS GLOBAL vs TAILWIND" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Verificar se o CSS global está sobrescrevendo classes do Tailwind
Write-Host "`n1. Verificando CSS global..." -ForegroundColor Yellow
$cssContent = Get-Content "src/index.css" -Raw

# Verificar classes que podem estar conflitando
$conflitos = @(
    @{ classe = "main-content"; problema = "margin-left pode interferir com flexbox" },
    @{ classe = "card"; problema = "background-color pode sobrescrever Tailwind" },
    @{ classe = "sidebar"; problema = "transform pode interferir com responsividade" },
    @{ classe = "transition-all"; problema = "comentado mas pode causar conflitos" }
)

foreach ($conflito in $conflitos) {
    if ($cssContent -match $conflito.classe) {
        Write-Host "⚠️  $($conflito.classe): $($conflito.problema)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ $($conflito.classe): OK" -ForegroundColor Green
    }
}

# Verificar se há !important desnecessário
Write-Host "`n2. Verificando uso de !important..." -ForegroundColor Yellow
$importantCount = ($cssContent | Select-String "!important").Count
if ($importantCount -gt 0) {
    Write-Host "⚠️  Encontrados $importantCount usos de !important" -ForegroundColor Yellow
    Write-Host "   Isso pode causar conflitos com Tailwind" -ForegroundColor Yellow
} else {
    Write-Host "✅ Nenhum !important encontrado" -ForegroundColor Green
}

# Verificar se há regras que podem interferir com Tailwind
Write-Host "`n3. Verificando regras que podem interferir..." -ForegroundColor Yellow
$regrasProblema = @(
    "margin-left",
    "display: flex",
    "flex-direction",
    "align-items",
    "justify-content"
)

foreach ($regra in $regrasProblema) {
    if ($cssContent -match $regra) {
        Write-Host "⚠️  $regra encontrado no CSS global" -ForegroundColor Yellow
    }
}

# Verificar se as classes Tailwind estão sendo aplicadas corretamente
Write-Host "`n4. Verificando classes Tailwind nas páginas..." -ForegroundColor Yellow
$arquivos = Get-ChildItem -Path "src" -Recurse -Include "*.jsx" | Where-Object { $_.Name -like "*Responsive*" }

foreach ($arquivo in $arquivos) {
    $conteudo = Get-Content $arquivo.FullName -Raw
    $classesTailwind = @(
        "text-yellow-400",
        "text-white", 
        "bg-gray-800",
        "max-w-4xl",
        "mx-auto",
        "flex",
        "items-center",
        "justify-center"
    )
    
    $count = 0
    foreach ($classe in $classesTailwind) {
        if ($conteudo -match $classe) {
            $count++
        }
    }
    
    Write-Host "📄 $($arquivo.Name): $count classes Tailwind encontradas" -ForegroundColor Cyan
}

# Verificar se o Design System está sendo usado
Write-Host "`n5. Verificando uso do Design System..." -ForegroundColor Yellow
$designSystemUsage = @(
    "StandardPageLayout",
    "ResponsiveCard",
    "ResponsiveGrid", 
    "ResponsiveTable",
    "DESIGN_SYSTEM"
)

foreach ($arquivo in $arquivos) {
    $conteudo = Get-Content $arquivo.FullName -Raw
    $count = 0
    foreach ($componente in $designSystemUsage) {
        if ($conteudo -match $componente) {
            $count++
        }
    }
    
    if ($count -gt 0) {
        Write-Host "✅ $($arquivo.Name): $count componentes do Design System" -ForegroundColor Green
    } else {
        Write-Host "❌ $($arquivo.Name): Nenhum componente do Design System" -ForegroundColor Red
    }
}

# Verificar se há problemas de responsividade
Write-Host "`n6. Verificando responsividade..." -ForegroundColor Yellow
$responsiveClasses = @(
    "grid-cols-1",
    "sm:grid-cols-2", 
    "md:grid-cols-3",
    "lg:grid-cols-4",
    "md:text-2xl",
    "md:p-6"
)

$totalResponsive = 0
foreach ($arquivo in $arquivos) {
    $conteudo = Get-Content $arquivo.FullName -Raw
    foreach ($classe in $responsiveClasses) {
        $matches = ($conteudo | Select-String $classe).Count
        $totalResponsive += $matches
    }
}

Write-Host "📱 Total de classes responsivas encontradas: $totalResponsive" -ForegroundColor Cyan

# Recomendações
Write-Host "`n7. RECOMENDAÇÕES:" -ForegroundColor Cyan
Write-Host "1. Use apenas classes Tailwind para layout e espaçamento" -ForegroundColor White
Write-Host "2. Evite CSS global que pode interferir com Tailwind" -ForegroundColor White
Write-Host "3. Use o Design System para consistência" -ForegroundColor White
Write-Host "4. Teste responsividade em todos os dispositivos" -ForegroundColor White
Write-Host "5. Use !important apenas quando necessário" -ForegroundColor White

Write-Host "`n🎯 VERIFICAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "Verifique os itens marcados com ⚠️ para correção" -ForegroundColor Yellow

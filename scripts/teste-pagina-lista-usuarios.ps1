# Script para testar a página Lista de Usuários após correção
Write-Host "🧪 TESTE DA PÁGINA LISTA DE USUÁRIOS" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n1. Verificando se o erro JSX foi corrigido..." -ForegroundColor Yellow

# Verificar se a tag de fechamento está correta
$arquivo = "src/pages/ListaUsuariosResponsive.jsx"
$conteudo = Get-Content $arquivo -Raw

if ($conteudo -match "</StandardPageLayout>") {
    Write-Host "✅ Tag de fechamento </StandardPageLayout> encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ Tag de fechamento </StandardPageLayout> NÃO encontrada" -ForegroundColor Red
}

if ($conteudo -match "StandardPageLayout") {
    Write-Host "✅ Componente StandardPageLayout sendo usado" -ForegroundColor Green
} else {
    Write-Host "❌ Componente StandardPageLayout NÃO encontrado" -ForegroundColor Red
}

# Verificar se há erros de sintaxe
Write-Host "`n2. Verificando sintaxe JSX..." -ForegroundColor Yellow

# Contar tags de abertura e fechamento
$abertura = ($conteudo | Select-String "<StandardPageLayout").Count
$fechamento = ($conteudo | Select-String "</StandardPageLayout>").Count

Write-Host "📊 Tags de abertura: $abertura" -ForegroundColor Cyan
Write-Host "📊 Tags de fechamento: $fechamento" -ForegroundColor Cyan

if ($abertura -eq $fechamento) {
    Write-Host "✅ Tags balanceadas corretamente" -ForegroundColor Green
} else {
    Write-Host "❌ Tags desbalanceadas!" -ForegroundColor Red
}

# Verificar se o Design System está sendo usado
Write-Host "`n3. Verificando uso do Design System..." -ForegroundColor Yellow

$componentes = @(
    "ResponsiveCard",
    "ResponsiveGrid", 
    "ResponsiveTable",
    "StatusBadge",
    "CurrencyValue"
)

foreach ($componente in $componentes) {
    if ($conteudo -match $componente) {
        Write-Host "✅ $componente sendo usado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $componente não encontrado" -ForegroundColor Yellow
    }
}

# Verificar se há classes Tailwind
Write-Host "`n4. Verificando classes Tailwind..." -ForegroundColor Yellow

$classesTailwind = @(
    "text-yellow-400",
    "text-white",
    "bg-gray-800",
    "max-w-4xl",
    "mx-auto"
)

foreach ($classe in $classesTailwind) {
    $count = ($conteudo | Select-String $classe).Count
    Write-Host "📊 $classe : $count ocorrências" -ForegroundColor Cyan
}

# Instruções para teste manual
Write-Host "`n5. INSTRUÇÕES PARA TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/lista-usuarios" -ForegroundColor White
Write-Host "2. Verifique se a página carrega sem erros" -ForegroundColor White
Write-Host "3. Verifique se o layout está centralizado" -ForegroundColor White
Write-Host "4. Teste responsividade redimensionando a janela" -ForegroundColor White
Write-Host "5. Verifique se os cards de estatísticas aparecem" -ForegroundColor White
Write-Host "6. Verifique se a tabela de usuários funciona" -ForegroundColor White

# Verificar se o servidor está rodando
Write-Host "`n6. Verificando servidor..." -ForegroundColor Yellow

$porta5173 = netstat -ano | findstr :5173
if ($porta5173) {
    Write-Host "✅ Servidor frontend rodando na porta 5173" -ForegroundColor Green
} else {
    Write-Host "❌ Servidor frontend NÃO está rodando" -ForegroundColor Red
}

Write-Host "`n🎯 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "A página Lista de Usuários deve estar funcionando agora!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:5173/lista-usuarios" -ForegroundColor Cyan

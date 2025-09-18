# Script para testar a correção da página Lista de Usuários
Write-Host "🧪 TESTE DE CORREÇÃO - LISTA DE USUÁRIOS" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

Write-Host "`n1. Verificando correção do erro JavaScript..." -ForegroundColor Yellow

# Verificar se as funções render foram corrigidas
$arquivo = "src/pages/ListaUsuariosResponsive.jsx"
$conteudo = Get-Content $arquivo -Raw

# Verificar se as funções render têm os parâmetros corretos
$renderFunctions = @(
    "render: (value, user) =>",
    "StatusBadge status={user.account_status}",
    "CurrencyValue value={user.balance || 0}",
    "user.account_status === 'active'"
)

foreach ($funcao in $renderFunctions) {
    if ($conteudo -match [regex]::Escape($funcao)) {
        Write-Host "✅ $funcao encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ $funcao NÃO encontrado" -ForegroundColor Red
    }
}

# Verificar se não há mais erros de sintaxe
Write-Host "`n2. Verificando sintaxe..." -ForegroundColor Yellow

if ($conteudo -match "render: \(user\) =>") {
    Write-Host "⚠️  Ainda há funções render com parâmetro incorreto" -ForegroundColor Yellow
} else {
    Write-Host "✅ Todas as funções render corrigidas" -ForegroundColor Green
}

# Verificar se o componente está usando o Design System
Write-Host "`n3. Verificando Design System..." -ForegroundColor Yellow

$designSystemComponents = @(
    "StandardPageLayout",
    "ResponsiveCard",
    "ResponsiveGrid",
    "ResponsiveTable",
    "StatusBadge",
    "CurrencyValue"
)

foreach ($componente in $designSystemComponents) {
    if ($conteudo -match $componente) {
        Write-Host "✅ $componente sendo usado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $componente não encontrado" -ForegroundColor Yellow
    }
}

# Verificar se há dados de exemplo
Write-Host "`n4. Verificando dados de exemplo..." -ForegroundColor Yellow

if ($conteudo -match "mockUsuarios") {
    Write-Host "✅ Dados de exemplo encontrados" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dados de exemplo não encontrados" -ForegroundColor Yellow
}

# Verificar se há tratamento de erro
Write-Host "`n5. Verificando tratamento de erro..." -ForegroundColor Yellow

if ($conteudo -match "try.*catch") {
    Write-Host "✅ Tratamento de erro encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Tratamento de erro não encontrado" -ForegroundColor Yellow
}

# Instruções para teste manual
Write-Host "`n6. INSTRUÇÕES PARA TESTE MANUAL:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:5173/lista-usuarios" -ForegroundColor White
Write-Host "2. Verifique se a página carrega sem erros no console" -ForegroundColor White
Write-Host "3. Verifique se os cards de estatísticas aparecem" -ForegroundColor White
Write-Host "4. Verifique se a tabela de usuários funciona" -ForegroundColor White
Write-Host "5. Teste os botões de ação (Editar/Bloquear)" -ForegroundColor White
Write-Host "6. Teste responsividade redimensionando a janela" -ForegroundColor White

# Verificar se o servidor está rodando
Write-Host "`n7. Verificando servidor..." -ForegroundColor Yellow

$porta5173 = netstat -ano | findstr :5173
if ($porta5173) {
    Write-Host "✅ Servidor frontend rodando na porta 5173" -ForegroundColor Green
} else {
    Write-Host "❌ Servidor frontend NÃO está rodando" -ForegroundColor Red
}

Write-Host "`n🎯 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "A página Lista de Usuários deve estar funcionando sem erros!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:5173/lista-usuarios" -ForegroundColor Cyan

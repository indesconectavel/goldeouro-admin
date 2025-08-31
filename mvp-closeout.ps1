# ============================
# MVP CLOSE-OUT: ADMIN + RENDER
# ============================
# O que este script faz:
# 1) Atualiza VITE_API_URL no Vercel (dev/preview/prod) sem interação
# 2) Valida backend no Render (health + CORS preflight)
# 3) (Opcional) testa rota protegida com x-admin-token
# 4) Faz deploy do admin no Vercel
# 5) Exibe checklist final

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# ---------- CONFIGS (edite se precisar) ----------
# URL pública do backend (Render)
$API = 'https://goldeouro-backend.onrender.com'

# Origem do admin em produção (Vercel) — usada no teste de CORS
$ADMIN_ORIGIN = 'https://goldeouro-admin.vercel.app'

# Pasta do admin (onde está o projeto Vite + vercel.json)
$ADMIN_DIR_NAME = 'goldeouro-admin'

# Timeout p/ requisições (segundos)
$TIMEOUT = 45

# (Opcional) Se quiser testar rota /admin/test, exporte ADMIN_TOKEN no shell antes de rodar
$ADMIN_TOKEN = $env:ADMIN_TOKEN

# ---------- Funções utilitárias ----------
function Write-Section($title) {
  Write-Host ""
  Write-Host "==================== $title ====================" -ForegroundColor Cyan
}

function Test-Http($url, $method = 'GET', $headers = @{}, $body = $null) {
  try {
    $params = @{
      Uri         = $url
      Method      = $method
      Headers     = $headers
      TimeoutSec  = $TIMEOUT
      ErrorAction = 'Stop'
    }
    if ($body) { $params['Body'] = $body }
    $resp = Invoke-WebRequest @params
    return @{ ok = $true; code = [int]$resp.StatusCode; headers = $resp.Headers; raw = $resp }
  } catch {
    $code = $null
    try { $code = [int]$_.Exception.Response.StatusCode.value__ } catch {}
    return @{ ok = $false; code = $code; error = $_.Exception.Message }
  }
}

function Ensure-InFolder($folderName) {
  $root = Get-Location
  if (Test-Path -LiteralPath $folderName) {
    Set-Location -LiteralPath $folderName
  } else {
    throw "Pasta '$folderName' não encontrada em '$root'. Abra o terminal na raiz do monorepo e rode novamente."
  }
}

# ---------- 1) Atualizar VITE_API_URL no Vercel ----------
Write-Section "1) Atualizando VITE_API_URL no Vercel (sem prompts)"
Ensure-InFolder $ADMIN_DIR_NAME

# Remover variáveis antigas (ignora erro se não existir)
vercel env rm VITE_API_URL development --yes 2>$null
vercel env rm VITE_API_URL preview     --yes 2>$null
vercel env rm VITE_API_URL production  --yes 2>$null

# Adicionar valores NOVOS sem interação (Windows precisa usar cmd /c para pipe)
# Dev aponta para backend local (mantemos assim para desenvolvimento)
cmd /c "echo http://localhost:3000 | vercel env add VITE_API_URL development"

# Preview/Prod apontam para Render
cmd /c "echo $API | vercel env add VITE_API_URL preview"
cmd /c "echo $API | vercel env add VITE_API_URL production"

# Conferir
vercel env ls

# ---------- 2) Validações de Backend no Render ----------
Write-Section "2) Validando backend no Render"

# 2.1 Health check
$health = Test-Http "$API/health" 'GET'
if (-not $health.ok -or $health.code -ne 200) {
  Write-Host "❌ Health check falhou ($($health.code)) - $($health.error)" -ForegroundColor Red
} else {
  Write-Host "✅ Health OK ($($health.code))" -ForegroundColor Green
}

# 2.2 CORS preflight (OPTIONS) simulando chamada do admin (Vercel)
$preflightHeaders = @{
  'Origin'                         = $ADMIN_ORIGIN
  'Access-Control-Request-Method'  = 'GET'
  'Access-Control-Request-Headers' = 'x-admin-token'
}
$cors = Test-Http "$API/health" 'OPTIONS' $preflightHeaders
$corsOk = $false
if ($cors.ok) {
  $allowOrigin = $cors.headers['access-control-allow-origin']
  if ($allowOrigin -eq $ADMIN_ORIGIN -or $allowOrigin -eq '*') { $corsOk = $true }
}

if ($corsOk) {
  Write-Host "✅ CORS preflight OK (allow-origin: $($cors.headers['access-control-allow-origin']))" -ForegroundColor Green
} else {
  Write-Host "❌ CORS preflight falhou. allow-origin: '$($cors.headers['access-control-allow-origin'])' code=$($cors.code) err=$($cors.error)" -ForegroundColor Red
}

# 2.3 (Opcional) Rota protegida (apenas se houver token)
$adminProtectedResult = $null
if ($ADMIN_TOKEN) {
  $adminProtected = Test-Http "$API/admin/test" 'GET' @{ 'x-admin-token' = $ADMIN_TOKEN }
  $adminProtectedResult = if ($adminProtected.ok -and $adminProtected.code -eq 200) { "OK (200)" } else { "Falhou ($($adminProtected.code))" }
  if ($adminProtected.ok -and $adminProtected.code -eq 200) {
    Write-Host "✅ Rota protegida OK (200)" -ForegroundColor Green
  } else {
    Write-Host "⚠️  Rota protegida respondeu $($adminProtected.code). (Esperado 200 com token válido)" -ForegroundColor Yellow
  }
} else {
  $adminProtectedResult = "Ignorado (sem ADMIN_TOKEN)"
  Write-Host "ℹ️  Teste de rota protegida ignorado (exporte ADMIN_TOKEN se quiser validar)" -ForegroundColor Yellow
}

# ---------- 3) Deploy do admin no Vercel ----------
Write-Section "3) Deploy do admin no Vercel (produção)"
# Dica: se não estiver linkado, faça manualmente uma vez:  vercel link
vercel --prod --yes

# ---------- 4) Checklist Final ----------
Write-Section "4) CHECKLIST FINAL"
$rows = @(
  @{ Item = "Vercel ENV dev (http://localhost:3000)";     Status = "aplicado" }
  @{ Item = "Vercel ENV preview/prod ($API)";             Status = "aplicado" }
  @{ Item = "Health ($API/health)";                       Status = (if ($health.ok -and $health.code -eq 200) { "OK (200)" } else { "FALHOU ($($health.code))" }) }
  @{ Item = "CORS preflight (Origin=$ADMIN_ORIGIN)";      Status = (if ($corsOk) { "OK" } else { "FALHOU" }) }
  @{ Item = "Rota protegida (/admin/test)";               Status = $adminProtectedResult }
  @{ Item = "Deploy admin (vercel --prod)";               Status = "feito" }
)

# Impressão bonitinha
$maxItem = ($rows.Item | Measure-Object -Maximum -Property Length).Maximum
$maxStatus = ($rows.Status | Measure-Object -Maximum -Property Length).Maximum
"{0}  {1}" -f ("Item".PadRight($maxItem)), ("Status".PadRight($maxStatus)) | Write-Host -ForegroundColor White
("-" * ($maxItem + 2 + $maxStatus)) | Write-Host -ForegroundColor DarkGray
foreach($r in $rows){
  "{0}  {1}" -f ($r.Item.PadRight($maxItem)), ($r.Status.PadRight($maxStatus)) | Write-Host
}

Write-Host ""
Write-Host "✅ Etapa do MVP concluída. Se algum item acima estiver 'FALHOU', reabra a seção correspondente e ajuste." -ForegroundColor Green

# Voltar pra raiz do repo
Set-Location ..

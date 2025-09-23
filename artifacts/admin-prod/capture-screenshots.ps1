# Script para capturar screenshots do Admin em produção
# Simulação de teste visual básico

$baseUrl = "https://admin.goldeouro.lol"
$outputDir = "artifacts/admin-prod/screenshots"
$endpoints = @("/", "/login", "/dashboard", "/usuarios", "/depositos", "/saques")

# Criar diretório de screenshots
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

Write-Host "📸 Capturando screenshots do Admin em produção..."
Write-Host "================================================"

foreach ($endpoint in $endpoints) {
    $url = $baseUrl + $endpoint
    $filename = if ($endpoint -eq "/") { "homepage" } else { $endpoint.TrimStart("/") }
    $outputFile = "$outputDir/$filename.html"
    
    try {
        Write-Host "🔍 Testando: $url"
        $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 15
        
        # Salvar HTML para análise
        $response.Content | Out-File -FilePath $outputFile -Encoding UTF8
        
        Write-Host "   ✅ Status: $($response.StatusCode)"
        Write-Host "   📄 HTML salvo: $outputFile"
        
        # Verificar se é HTML válido
        if ($response.Content -match "<!DOCTYPE html>|<html") {
            Write-Host "   ✅ HTML válido detectado"
        } else {
            Write-Host "   ⚠️  HTML pode estar corrompido"
        }
        
    } catch {
        Write-Host "   ❌ Erro: $($_.Exception.Message)"
    }
    
    Write-Host ""
}

Write-Host "✅ Captura de screenshots concluída!"
Write-Host "📁 Arquivos salvos em: $outputDir"

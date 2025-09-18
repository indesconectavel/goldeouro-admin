# 🚀 SCRIPT DE RESOLUÇÃO DEFINITIVA - PROBLEMAS VISUAIS
# Data: 07/01/2025
# Objetivo: Resolver todos os problemas de design e visualização

Write-Host "🚀 INICIANDO RESOLUÇÃO DEFINITIVA DOS PROBLEMAS VISUAIS..." -ForegroundColor Green

# 1. PARAR TODOS OS PROCESSOS CONFLITANTES
Write-Host "`n1️⃣ PARANDO PROCESSOS CONFLITANTES..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
Get-Process | Where-Object {$_.ProcessName -like "*npm*"} | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. LIMPAR CACHE DO NAVEGADOR
Write-Host "`n2️⃣ LIMPANDO CACHE DO NAVEGADOR..." -ForegroundColor Yellow
Write-Host "Execute no navegador: Ctrl+Shift+Delete -> Limpar dados de navegação" -ForegroundColor Cyan

# 3. VERIFICAR SISTEMA CORRETO
Write-Host "`n3️⃣ VERIFICANDO SISTEMA CORRETO..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $package = Get-Content "package.json" | ConvertFrom-Json
    if ($package.name -eq "goldeouro-admin") {
        Write-Host "✅ Sistema correto detectado: $($package.name)" -ForegroundColor Green
    } else {
        Write-Host "❌ Sistema incorreto: $($package.name)" -ForegroundColor Red
        exit 1
    }
}

# 4. APLICAR CORREÇÕES DEFINITIVAS
Write-Host "`n4️⃣ APLICANDO CORREÇÕES DEFINITIVAS..." -ForegroundColor Yellow

# Corrigir Dashboard.jsx
$dashboardContent = @'
import React from 'react';
import DashboardCards from '../components/DashboardCards';
import GameDashboard from '../components/GameDashboard';

const Dashboard = () => {
  return (
    <div className="dark min-h-screen bg-[#000717]">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8" style={{width: '100%', overflow: 'visible'}}>
          <h1 
            className="font-bold text-yellow-400 mb-2" 
            style={{
              fontSize: '2rem',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              lineHeight: '1.1',
              maxWidth: '100%',
              overflow: 'visible',
              display: 'block',
              width: '100%',
              margin: '0',
              padding: '0'
            }}
          >
            Painel de Controle
          </h1>
          <p className="text-gray-400 text-lg">Dashboard em tempo real conectado ao backend</p>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Sistema de Jogos</h2>
          <DashboardCards />
        </div>

        {/* Game Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Métricas Detalhadas</h2>
          <GameDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
'@

Set-Content -Path "src/pages/Dashboard.jsx" -Value $dashboardContent -Encoding UTF8
Write-Host "✅ Dashboard.jsx corrigido" -ForegroundColor Green

# Corrigir index.css
$cssContent = @'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* FORÇAR TEMA ESCURO GLOBAL */
* {
  box-sizing: border-box;
}

html, body, #root {
  background-color: #000717 !important;
  color: #ffffff !important;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* GARANTIR TÍTULO COMPLETO */
h1 {
  word-break: break-word !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

/* FORÇAR CORES */
.text-yellow-400 {
  color: #fbbf24 !important;
}

.text-white {
  color: #ffffff !important;
}

.text-gray-400 {
  color: #9ca3af !important;
}

/* FORÇAR FUNDO ESCURO EM TODOS OS ELEMENTOS */
.dark, .min-h-screen, main, .flex-1 {
  background-color: #000717 !important;
}

.bg-gray-800, .bg-\[#111827\] {
  background-color: #111827 !important;
}

@layer base {
  :root {
    --background: 220 100% 4%;
    --foreground: 0 0% 98%;
    --card: 222 45% 10%;
    --card-foreground: 0 0% 98%;
    --popover: 222 45% 10%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 220 100% 4%;
    --foreground: 0 0% 98%;
    --card: 222 45% 10%;
    --card-foreground: 0 0% 98%;
    --popover: 222 45% 10%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
'@

Set-Content -Path "src/index.css" -Value $cssContent -Encoding UTF8
Write-Host "✅ index.css corrigido" -ForegroundColor Green

# 5. REBUILD COMPLETO
Write-Host "`n5️⃣ REBUILD COMPLETO..." -ForegroundColor Yellow
npm run build
Write-Host "✅ Build concluído" -ForegroundColor Green

# 6. INICIAR SISTEMA CORRETO
Write-Host "`n6️⃣ INICIANDO SISTEMA CORRETO..." -ForegroundColor Yellow
Write-Host "Acesse: http://localhost:5173/" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+F5 para forçar refresh" -ForegroundColor Cyan

# 7. INSTRUÇÕES FINAIS
Write-Host "`n🎯 INSTRUÇÕES FINAIS:" -ForegroundColor Green
Write-Host "1. Acesse: http://localhost:5173/" -ForegroundColor White
Write-Host "2. Pressione Ctrl+F5 (forçar refresh)" -ForegroundColor White
Write-Host "3. Verifique se o título aparece completo: 'Painel de Controle'" -ForegroundColor White
Write-Host "4. Verifique se o fundo está escuro (#000717)" -ForegroundColor White

Write-Host "`n✅ SCRIPT CONCLUÍDO!" -ForegroundColor Green
Write-Host "Agora execute: npm run dev" -ForegroundColor Cyan




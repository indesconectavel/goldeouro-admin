# Script para resolver erros de Service Worker e CSP
Write-Host "🔧 Resolvendo erros de Service Worker e CSP..." -ForegroundColor Yellow

# 1. Parar todos os processos Node.js
Write-Host "⏹️ Parando processos Node.js..." -ForegroundColor Blue
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
Get-Process | Where-Object {$_.ProcessName -eq "npm"} | Stop-Process -Force

# 2. Limpar cache do navegador
Write-Host "🧹 Limpando cache do navegador..." -ForegroundColor Blue
Write-Host "Por favor, abra o DevTools (F12) e clique com botão direito no botão de refresh, selecione 'Empty Cache and Hard Reload'" -ForegroundColor Yellow

# 3. Corrigir Service Worker para não tentar cachear extensões do Chrome
Write-Host "🔧 Corrigindo Service Worker..." -ForegroundColor Blue
$swContent = @"
const CACHE_NAME = 'goldeouro-admin-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Função para verificar se a URL é válida para cache
function isValidUrlForCache(url) {
  // Não tentar cachear URLs de extensões do Chrome
  if (url.startsWith('chrome-extension://')) {
    return false;
  }
  // Não tentar cachear URLs de data:
  if (url.startsWith('data:')) {
    return false;
  }
  // Não tentar cachear URLs de blob:
  if (url.startsWith('blob:')) {
    return false;
  }
  return true;
}

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  // Só processar requisições válidas
  if (!isValidUrlForCache(event.request.url)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }
        // Senão, buscar da rede
        return fetch(event.request);
      })
  );
});
"@

Set-Content -Path ".\public\sw.js" -Value $swContent

# 4. Corrigir CSP no index.html
Write-Host "🔧 Corrigindo CSP no index.html..." -ForegroundColor Blue
$indexContent = @"
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/x-icon;base64,//5GAGEAdgBpAGMAbwBuACAAcABsAGEAYwBlAGgAbwBsAGQAZQByAA0ACgA=" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gol de Ouro - Painel Administrativo</title>
    <meta name="description" content="Painel administrativo do Gol de Ouro">
    <meta name="theme-color" content="#FCD34D">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    
    <!-- CSP mais permissivo para desenvolvimento -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: chrome-extension:; connect-src 'self' http://localhost:3000 https://admin.goldeouro.lol; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:;">
    
    <script type="module" crossorigin src="/assets/index-56e79123.js"></script>
    <link rel="stylesheet" href="/assets/index-f678d1bf.css">
  </head>
  <body>
    <div id="root"></div>
    
    <script>
      // Registrar Service Worker apenas se suportado
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(function(registration) {
            console.log('Service Worker registrado com sucesso:', registration);
          })
          .catch(function(error) {
            console.log('Erro ao registrar Service Worker:', error);
          });
      }
    </script>
  </body>
</html>
"@

Set-Content -Path ".\index.html" -Value $indexContent

# 5. Corrigir configuração do Vite para CSP
Write-Host "🔧 Corrigindo configuração do Vite..." -ForegroundColor Blue
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    cors: true,
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: chrome-extension:; connect-src 'self' http://localhost:3000 https://admin.goldeouro.lol; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:;"
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
"@

Set-Content -Path ".\vite.config.js" -Value $viteConfig

# 6. Corrigir API service para usar URLs corretas
Write-Host "🔧 Corrigindo API service..." -ForegroundColor Blue
$apiService = @"
// API Service para o painel administrativo
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Métodos para usuários
  async getUsuarios() {
    return this.request('/usuarios');
  }

  async getUsuario(id) {
    return this.request(`/usuarios/${id}`);
  }

  // Métodos para jogos
  async getJogos() {
    return this.request('/jogos');
  }

  async getJogo(id) {
    return this.request(`/jogos/${id}`);
  }

  // Métodos para apostas
  async getApostas() {
    return this.request('/apostas');
  }

  async getAposta(id) {
    return this.request(`/apostas/${id}`);
  }

  // Métodos para estatísticas
  async getEstatisticas() {
    return this.request('/estatisticas');
  }

  // Métodos para relatórios
  async getRelatorioFinanceiro() {
    return this.request('/relatorios/financeiro');
  }

  async getRelatorioUsuarios() {
    return this.request('/relatorios/usuarios');
  }

  async getRelatorioPorUsuario(id) {
    return this.request(`/relatorios/usuarios/${id}`);
  }
}

export default new ApiService();
"@

Set-Content -Path ".\src\services\api.js" -Value $apiService

# 7. Rebuildar o projeto
Write-Host "🔨 Rebuildando projeto..." -ForegroundColor Blue
npm run build

# 8. Iniciar servidor de desenvolvimento
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "Acesse: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow

npm run dev




#!/usr/bin/env node

/**
 * Script de Deploy de Produção - Correção CSP
 * Corrige problemas de CSP no domínio admin.goldeouro.lol
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 CORRIGINDO DEPLOY DE PRODUÇÃO - GOL DE OURO');
console.log('==============================================\n');

// 1. Build de produção com configuração corrigida
console.log('📦 FAZENDO BUILD DE PRODUÇÃO...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Build de produção concluído\n');
} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}

// 2. Verificar se build foi criado
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Diretório dist não encontrado');
  process.exit(1);
}

console.log('✅ Diretório dist criado com sucesso\n');

// 3. Criar arquivo de configuração para Vercel
console.log('📝 CRIANDO CONFIGURAÇÃO DO VERCEL...');
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "dist/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://admin.goldeouro.lol https://goldeouro-admin.vercel.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://admin.goldeouro.lol https://goldeouro-admin.vercel.app https://api.goldeouro.lol; object-src 'none';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
};

fs.writeFileSync(
  path.join(__dirname, '..', 'vercel.json'),
  JSON.stringify(vercelConfig, null, 2)
);
console.log('✅ Configuração do Vercel criada\n');

// 4. Criar arquivo .env.production
console.log('📝 CRIANDO ARQUIVO .ENV.PRODUCTION...');
const envProduction = `# Configurações de Produção - Gol de Ouro Admin
VITE_API_URL=https://api.goldeouro.lol
VITE_ADMIN_TOKEN=adm_8d1e3c7a5b9f2a4c6e0d1f3b7a9c5e2d
VITE_APP_NAME=Gol de Ouro Admin
VITE_APP_VERSION=4.1.0
VITE_APP_ENV=production
`;

fs.writeFileSync(
  path.join(__dirname, '..', '.env.production'),
  envProduction
);
console.log('✅ Arquivo .env.production criado\n');

// 5. Atualizar package.json com script de deploy
console.log('📝 ATUALIZANDO PACKAGE.JSON...');
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  "build:prod": "vite build --config vite.config.prod.js",
  "deploy:prod": "npm run build:prod && vercel --prod",
  "deploy:fix": "node scripts/deploy-production-fix.js"
};

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log('✅ Package.json atualizado\n');

// 6. Criar relatório de correção
console.log('📋 CRIANDO RELATÓRIO DE CORREÇÃO...');
const correctionReport = {
  timestamp: new Date().toISOString(),
  version: '4.1.0',
  environment: 'production',
  fixes: [
    'Content Security Policy corrigido',
    'Google Fonts permitido',
    'Domínios de produção adicionados',
    'Headers de segurança configurados',
    'Build de produção otimizado'
  ],
  csp: {
    scriptSrc: "'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://admin.goldeouro.lol https://goldeouro-admin.vercel.app",
    styleSrc: "'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    fontSrc: "'self' https://fonts.gstatic.com",
    imgSrc: "'self' data: https: blob:",
    connectSrc: "'self' https://admin.goldeouro.lol https://goldeouro-admin.vercel.app https://api.goldeouro.lol"
  },
  status: 'READY_FOR_DEPLOY'
};

fs.writeFileSync(
  path.join(__dirname, '..', 'production-fix-report.json'),
  JSON.stringify(correctionReport, null, 2)
);
console.log('✅ Relatório de correção criado\n');

// 7. Resumo final
console.log('🎉 CORREÇÃO DE PRODUÇÃO CONCLUÍDA!');
console.log('==================================');
console.log('✅ CSP corrigido para domínio de produção');
console.log('✅ Google Fonts permitido');
console.log('✅ Build de produção otimizado');
console.log('✅ Configuração do Vercel atualizada');
console.log('✅ Headers de segurança configurados');

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('1. Execute: npm run deploy:prod');
console.log('2. Ou faça deploy manual no Vercel');
console.log('3. Teste: https://admin.goldeouro.lol');

console.log('\n🔧 COMANDOS DISPONÍVEIS:');
console.log('- npm run build:prod    # Build com configuração de produção');
console.log('- npm run deploy:prod   # Deploy automático');
console.log('- npm run deploy:fix    # Executar este script');

console.log('\n✅ SISTEMA PRONTO PARA DEPLOY DE PRODUÇÃO!');

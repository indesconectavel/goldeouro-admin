#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy de produção...\n');

try {
  // 1. Limpar dist anterior
  console.log('🧹 Limpando build anterior...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // 2. Instalar dependências
  console.log('📦 Instalando dependências...');
  execSync('npm ci --production=false', { stdio: 'inherit' });

  // 3. Build de produção
  console.log('🔨 Fazendo build de produção...');
  execSync('npm run build:prod', { stdio: 'inherit' });

  // 4. Verificar se build foi criado
  if (!fs.existsSync('dist')) {
    throw new Error('Build não foi criado!');
  }

  // 5. Verificar tamanho do bundle
  const distStats = fs.statSync('dist');
  const distSize = (distStats.size / 1024 / 1024).toFixed(2);
  console.log(`📊 Tamanho do build: ${distSize} MB`);

  // 6. Deploy para Vercel
  console.log('🌐 Fazendo deploy para Vercel...');
  execSync('vercel --prod --yes', { stdio: 'inherit' });

  console.log('\n✅ Deploy concluído com sucesso!');
  console.log('🔗 Aplicação disponível em: https://goldeouro-admin.vercel.app');

} catch (error) {
  console.error('\n❌ Erro durante o deploy:', error.message);
  process.exit(1);
}



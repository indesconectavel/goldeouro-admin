#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando correções implementadas...\n');

// Verificar se os arquivos foram modificados corretamente
const filesToCheck = [
  'src/index.css',
  'src/layouts/MainLayout.jsx',
  'src/components/Sidebar.jsx',
  'src/pages/Dashboard.jsx',
  'src/components/DashboardCards.jsx',
  'src/components/GameDashboard.jsx'
];

let allGood = true;

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`✅ ${file} - Arquivo encontrado`);
    
    // Verificações específicas
    if (file === 'src/index.css') {
      if (content.includes('.card {') && content.includes('.sidebar {') && content.includes('.main-content {')) {
        console.log('   ✅ Classes CSS customizadas aplicadas');
      } else {
        console.log('   ❌ Classes CSS customizadas não encontradas');
        allGood = false;
      }
    }
    
    if (file === 'src/layouts/MainLayout.jsx') {
      if (content.includes('main-content') && !content.includes('md:ml-64')) {
        console.log('   ✅ Layout simplificado aplicado');
      } else {
        console.log('   ❌ Layout ainda tem problemas');
        allGood = false;
      }
    }
    
    if (file === 'src/components/Sidebar.jsx') {
      if (content.includes('sidebar') && content.includes('Overlay')) {
        console.log('   ✅ Sidebar responsiva implementada');
      } else {
        console.log('   ❌ Sidebar não foi corrigida');
        allGood = false;
      }
    }
    
    if (file === 'src/pages/Dashboard.jsx') {
      if (!content.includes('style={{') && content.includes('heading-responsive')) {
        console.log('   ✅ Dashboard limpo de estilos inline');
      } else {
        console.log('   ❌ Dashboard ainda tem estilos inline');
        allGood = false;
      }
    }
    
    if (file === 'src/components/DashboardCards.jsx') {
      if (content.includes('card p-4') && content.includes('overflow-hidden')) {
        console.log('   ✅ Cards usando classes CSS customizadas');
      } else {
        console.log('   ❌ Cards ainda usando classes Tailwind antigas');
        allGood = false;
      }
    }
    
  } else {
    console.log(`❌ ${file} - Arquivo não encontrado`);
    allGood = false;
  }
});

console.log('\n📊 Resumo das correções:');

if (allGood) {
  console.log('✅ Todas as correções foram aplicadas com sucesso!');
  console.log('\n🚀 Próximos passos:');
  console.log('1. Execute: npm run dev');
  console.log('2. Abra: http://localhost:5173');
  console.log('3. Teste a responsividade redimensionando a janela');
  console.log('4. Verifique se a sidebar funciona em mobile');
} else {
  console.log('❌ Algumas correções não foram aplicadas corretamente');
  console.log('\n🔧 Ações necessárias:');
  console.log('1. Verifique os arquivos listados acima');
  console.log('2. Aplique as correções manualmente se necessário');
  console.log('3. Execute novamente este script');
}

console.log('\n📱 Para testar visualmente:');
console.log('1. Abra o arquivo test-visual.html no navegador');
console.log('2. Redimensione a janela para testar responsividade');
console.log('3. Verifique se os elementos estão alinhados corretamente');

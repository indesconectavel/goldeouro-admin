#!/usr/bin/env node
/**
 * Script de Restauração de Dados para Desenvolvimento
 * Restaura dados fictícios apenas para ambiente de desenvolvimento
 */

const fs = require('fs');
const path = require('path');

// Arquivos a serem atualizados
const FILES_TO_UPDATE = [
  'src/pages/RelatorioUsuarios.jsx',
  'src/pages/UsuariosBloqueados.jsx',
  'src/pages/TopJogadores.jsx',
  'src/pages/Estatisticas.jsx',
  'src/pages/EstatisticasPadronizada.jsx',
  'src/pages/EstatisticasResponsive.jsx',
  'src/pages/EstatisticasResponsivePadronizada.jsx',
  'src/pages/ExportarDadosResponsive.jsx',
  'src/pages/ListaUsuariosResponsive.jsx',
  'src/pages/LogsSistema.jsx',
  'src/pages/LogsSistemaResponsive.jsx',
  'src/pages/MetricasJogos.jsx',
  'src/pages/RelatorioUsuariosResponsive.jsx',
  'src/pages/Saques.jsx',
  'src/pages/SaqueUsuarios.jsx',
  'src/pages/TopJogadoresResponsive.jsx',
  'src/pages/TopJogadoresResponsivePadronizada.jsx',
  'src/pages/Transacoes.jsx',
  'src/pages/TransacoesPadronizada.jsx',
  'src/pages/Users.jsx'
];

// Padrões de importação a serem adicionados
const IMPORT_PATTERNS = [
  {
    pattern: /import.*from.*['"]\.\.\/js\/api['"];?\s*$/m,
    replacement: `import { postData } from '../js/api';
import { shouldUseMockData, shouldFallbackToMock } from '../config/environment';
import { mockUsers, mockGames, mockTopPlayers, mockTransactions, mockLogs } from '../data/mockData';`
  }
];

// Padrões de fallback a serem atualizados
const FALLBACK_PATTERNS = [
  {
    name: 'setUsuarios fallback',
    pattern: /setUsuarios\(\[\]\);/g,
    replacement: `if (shouldFallbackToMock()) {
          setUsuarios(mockUsers);
        } else {
          setUsuarios([]);
        }`
  },
  {
    name: 'setJogadores fallback',
    pattern: /setJogadores\(\[\]\);/g,
    replacement: `if (shouldFallbackToMock()) {
          setJogadores(mockTopPlayers);
        } else {
          setJogadores([]);
        }`
  },
  {
    name: 'setTransacoes fallback',
    pattern: /setTransacoes\(\[\]\);/g,
    replacement: `if (shouldFallbackToMock()) {
          setTransacoes(mockTransactions);
        } else {
          setTransacoes([]);
        }`
  },
  {
    name: 'setLogs fallback',
    pattern: /setLogs\(\[\]\);/g,
    replacement: `if (shouldFallbackToMock()) {
          setLogs(mockLogs);
        } else {
          setLogs([]);
        }`
  }
];

function updateFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;

    // Adicionar imports se necessário
    if (!content.includes('shouldFallbackToMock')) {
      IMPORT_PATTERNS.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          hasChanges = true;
          console.log(`   📥 Adicionados imports para ${filePath}`);
        }
      });
    }

    // Atualizar padrões de fallback
    FALLBACK_PATTERNS.forEach(({ name, pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        hasChanges = true;
        console.log(`   🔄 Atualizado: ${name}`);
      }
    });

    if (hasChanges) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Atualizado: ${filePath}`);
      return true;
    } else {
      console.log(`⚪ Já atualizado: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Iniciando restauração de dados para desenvolvimento...\n');
  
  let updatedCount = 0;
  let totalFiles = FILES_TO_UPDATE.length;

  FILES_TO_UPDATE.forEach(file => {
    if (updateFile(file)) {
      updatedCount++;
    }
  });

  console.log(`\n📊 Resumo da restauração:`);
  console.log(`   Arquivos processados: ${totalFiles}`);
  console.log(`   Arquivos atualizados: ${updatedCount}`);
  console.log(`   Arquivos já atualizados: ${totalFiles - updatedCount}`);
  
  if (updatedCount > 0) {
    console.log('\n✅ Restauração de dados concluída com sucesso!');
    console.log('   📝 Dados fictícios agora aparecem apenas em desenvolvimento');
    console.log('   🚀 Produção continuará usando dados reais');
  } else {
    console.log('\n⚪ Nenhum arquivo precisou ser atualizado.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateFile, IMPORT_PATTERNS, FALLBACK_PATTERNS, FILES_TO_UPDATE };

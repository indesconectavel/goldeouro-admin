#!/usr/bin/env node
/**
 * Script de Correção de Sintaxe JavaScript
 * Corrige erros de sintaxe causados pela limpeza automatizada
 */

const fs = require('fs');
const path = require('path');

// Padrões de erro a serem corrigidos
const ERROR_PATTERNS = [
  {
    pattern: /} catch \(error\) \{\},\s*\{\},\s*\{\},\s*\{\},\s*\{\}\s*\]\);/g,
    replacement: `} catch (error) {
        console.error('Erro na requisição:', error);
        // Usar dados padrão em caso de erro
      }`
  },
  {
    pattern: /} catch \(error\) \{\},\s*\{\},\s*\{\}\s*\]\);/g,
    replacement: `} catch (error) {
        console.error('Erro na requisição:', error);
        // Usar dados padrão em caso de erro
      }`
  },
  {
    pattern: /} catch \(error\) \{\},\s*\{\}\s*\]\);/g,
    replacement: `} catch (error) {
        console.error('Erro na requisição:', error);
        // Usar dados padrão em caso de erro
      }`
  }
];

// Arquivos a serem corrigidos
const FILES_TO_FIX = [
  'src/pages/ListaUsuarios.jsx',
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

function fixFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;

    // Aplicar correções
    ERROR_PATTERNS.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Corrigido: ${filePath}`);
      return true;
    } else {
      console.log(`⚪ Já correto: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Iniciando correção de sintaxe JavaScript...\n');
  
  let fixedCount = 0;
  let totalFiles = FILES_TO_FIX.length;

  FILES_TO_FIX.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });

  console.log(`\n📊 Resumo da correção:`);
  console.log(`   Arquivos processados: ${totalFiles}`);
  console.log(`   Arquivos corrigidos: ${fixedCount}`);
  console.log(`   Arquivos já corretos: ${totalFiles - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n✅ Correção concluída com sucesso!');
  } else {
    console.log('\n⚪ Nenhum arquivo precisou ser corrigido.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, ERROR_PATTERNS, FILES_TO_FIX };

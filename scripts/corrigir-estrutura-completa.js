#!/usr/bin/env node
/**
 * Script de Correção Completa de Estrutura
 * Corrige todos os problemas de estrutura causados pelas correções anteriores
 */

const fs = require('fs');
const path = require('path');

// Padrões de erro a serem corrigidos
const STRUCTURE_PATTERNS = [
  {
    name: 'Código duplicado após loading',
    pattern: /if \(loading\) \{[^}]*\}\s*\}\s*setLoading\(false\);\s*\}\s*\};\s*fetchUsuarios\(\);\s*\}\s*\[\]\);/g,
    replacement: `if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }`
  },
  {
    name: 'Finally duplicado',
    pattern: /\}\s*finally\s*\{\s*setLoading\(false\);\s*\}\s*\};\s*fetchUsuarios\(\);\s*\}\s*\[\]\);\s*\}\s*finally\s*\{\s*setLoading\(false\);\s*\}\s*\};\s*fetchUsuarios\(\);\s*\}\s*\[\]\);/g,
    replacement: `}
    };

    fetchUsuarios();
  }, []);`
  },
  {
    name: 'Código solto após catch',
    pattern: /\}\s*catch\s*\(error\)\s*\{\s*console\.error\([^}]*\);\s*setUsuarios\(\[\]\);\s*\}\s*\}\s*finally\s*\{\s*setLoading\(false\);\s*\}\s*\};\s*fetchUsuarios\(\);\s*\}\s*\[\]\);/g,
    replacement: `} catch (error) {
      console.error('Erro na requisição:', error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUsuarios();
}, []);`
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

function fixFileStructure(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;

    // Aplicar correções de estrutura
    STRUCTURE_PATTERNS.forEach(({ name, pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        hasChanges = true;
        console.log(`   🔧 Aplicada correção: ${name}`);
      }
    });

    // Limpeza adicional de código duplicado
    const duplicatePatterns = [
      /(\}\s*finally\s*\{\s*setLoading\(false\);\s*\}\s*\};\s*fetchUsuarios\(\);\s*\}\s*\[\]\);)\s*\1/g,
      /(\}\s*catch\s*\(error\)\s*\{\s*console\.error\([^}]*\);\s*setUsuarios\(\[\]\);\s*\}\s*finally\s*\{\s*setLoading\(false\);\s*\}\s*\};\s*fetchUsuarios\(\);\s*\}\s*\[\]\);)\s*\1/g
    ];

    duplicatePatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '$1');
        hasChanges = true;
        console.log(`   🧹 Removido código duplicado`);
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
  console.log('🔧 Iniciando correção completa de estrutura...\n');
  
  let fixedCount = 0;
  let totalFiles = FILES_TO_FIX.length;

  FILES_TO_FIX.forEach(file => {
    if (fixFileStructure(file)) {
      fixedCount++;
    }
  });

  console.log(`\n📊 Resumo da correção:`);
  console.log(`   Arquivos processados: ${totalFiles}`);
  console.log(`   Arquivos corrigidos: ${fixedCount}`);
  console.log(`   Arquivos já corretos: ${totalFiles - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n✅ Correção de estrutura concluída com sucesso!');
  } else {
    console.log('\n⚪ Nenhum arquivo precisou ser corrigido.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFileStructure, STRUCTURE_PATTERNS, FILES_TO_FIX };

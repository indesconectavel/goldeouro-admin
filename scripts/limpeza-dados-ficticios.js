#!/usr/bin/env node
/**
 * Script de Limpeza de Dados Fictícios
 * Remove todos os dados hardcoded dos arquivos do Admin Panel
 */

const fs = require('fs');
const path = require('path');

// Padrões de dados fictícios a serem removidos
const FICTICIOUS_PATTERNS = [
  'João Silva',
  'Maria Santos', 
  'Pedro Costa',
  'Ana Oliveira',
  'Carlos Lima',
  'Lucia Ferreira',
  'Roberto Alves',
  'Fernanda Rocha',
  'Marcos Souza',
  'Juliana Martins'
];

// Arquivos a serem limpos
const FILES_TO_CLEAN = [
  'src/pages/Estatisticas.jsx',
  'src/pages/EstatisticasPadronizada.jsx',
  'src/pages/EstatisticasResponsive.jsx',
  'src/pages/EstatisticasResponsivePadronizada.jsx',
  'src/pages/ExportarDadosResponsive.jsx',
  'src/pages/ListaUsuarios.jsx',
  'src/pages/ListaUsuariosResponsive.jsx',
  'src/pages/LogsSistema.jsx',
  'src/pages/LogsSistemaResponsive.jsx',
  'src/pages/MetricasJogos.jsx',
  'src/pages/RelatorioUsuarios.jsx',
  'src/pages/RelatorioUsuariosResponsive.jsx',
  'src/pages/Saques.jsx',
  'src/pages/SaqueUsuarios.jsx',
  'src/pages/TopJogadores.jsx',
  'src/pages/TopJogadoresResponsive.jsx',
  'src/pages/TopJogadoresResponsivePadronizada.jsx',
  'src/pages/Transacoes.jsx',
  'src/pages/TransacoesPadronizada.jsx',
  'src/pages/Users.jsx',
  'src/pages/UsuariosBloqueados.jsx'
];

function cleanFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;

    // Remover dados fictícios
    FICTICIOUS_PATTERNS.forEach(pattern => {
      const regex = new RegExp(pattern, 'g');
      if (content.includes(pattern)) {
        content = content.replace(regex, 'Usuário');
        hasChanges = true;
      }
    });

    // Substituir arrays de dados fictícios por arrays vazios
    content = content.replace(/\[\s*\{[^}]*name:\s*['"][^'"]*['"][^}]*\}[,\s]*\}/g, '[]');
    
    // Substituir objetos com dados fictícios por objetos vazios
    content = content.replace(/\{\s*[^}]*name:\s*['"][^'"]*['"][^}]*\}/g, '{}');

    if (hasChanges) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Limpo: ${filePath}`);
      return true;
    } else {
      console.log(`⚪ Já limpo: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Erro ao limpar ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🧹 Iniciando limpeza de dados fictícios...\n');
  
  let cleanedCount = 0;
  let totalFiles = FILES_TO_CLEAN.length;

  FILES_TO_CLEAN.forEach(file => {
    if (cleanFile(file)) {
      cleanedCount++;
    }
  });

  console.log(`\n📊 Resumo da limpeza:`);
  console.log(`   Arquivos processados: ${totalFiles}`);
  console.log(`   Arquivos limpos: ${cleanedCount}`);
  console.log(`   Arquivos já limpos: ${totalFiles - cleanedCount}`);
  
  if (cleanedCount > 0) {
    console.log('\n✅ Limpeza concluída com sucesso!');
  } else {
    console.log('\n⚪ Nenhum arquivo precisou ser limpo.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { cleanFile, FICTICIOUS_PATTERNS, FILES_TO_CLEAN };

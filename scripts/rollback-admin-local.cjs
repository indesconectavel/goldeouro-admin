#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configurações
const BACKUP_TAG = process.argv[2] || 'BACKUP-ADMIN-LOCAL-20250922-2248';
const DRY_RUN = process.argv.includes('--dry-run');
const WORKTREE_DIR = 'temp-rollback-worktree';

console.log('🔄 Rollback Admin Local - Gol de Ouro');
console.log('=====================================');
console.log(`📅 Data: ${new Date().toISOString()}`);
console.log(`🏷️  Tag: ${BACKUP_TAG}`);
console.log(`🧪 Modo: ${DRY_RUN ? 'DRY-RUN' : 'EXECUÇÃO'}`);
console.log('');

function executeCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    if (DRY_RUN) {
      console.log(`   [DRY-RUN] ${command}`);
      return { success: true, output: '[DRY-RUN] Comando não executado' };
    } else {
      const output = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
      console.log(`   ✅ Sucesso`);
      return { success: true, output };
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function cleanup() {
  console.log('\n🧹 Limpeza...');
  try {
    if (fs.existsSync(WORKTREE_DIR)) {
      if (DRY_RUN) {
        console.log(`   [DRY-RUN] Removendo ${WORKTREE_DIR}`);
      } else {
        execSync(`git worktree remove ${WORKTREE_DIR} --force`, { stdio: 'ignore' });
        console.log(`   ✅ Worktree removido`);
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Erro na limpeza: ${error.message}`);
  }
}

async function rollback() {
  const results = {
    timestamp: new Date().toISOString(),
    tag: BACKUP_TAG,
    dryRun: DRY_RUN,
    steps: []
  };

  try {
    // 1. Verificar se a tag existe
    console.log('1. Verificando tag de backup...');
    const tagCheck = executeCommand(`git tag -l "${BACKUP_TAG}"`, 'Verificar tag');
    results.steps.push({ step: 'tag_check', ...tagCheck });
    
    if (!tagCheck.success) {
      throw new Error(`Tag ${BACKUP_TAG} não encontrada`);
    }

    // 2. Criar worktree temporário
    console.log('\n2. Criando worktree temporário...');
    const worktreeCreate = executeCommand(
      `git worktree add ${WORKTREE_DIR} ${BACKUP_TAG}`,
      'Criar worktree'
    );
    results.steps.push({ step: 'worktree_create', ...worktreeCreate });

    if (!worktreeCreate.success) {
      throw new Error('Falha ao criar worktree');
    }

    // 3. Verificar estado do worktree
    console.log('\n3. Verificando estado do worktree...');
    const worktreeStatus = executeCommand(
      `cd ${WORKTREE_DIR} && git log --oneline -5`,
      'Verificar commits no worktree'
    );
    results.steps.push({ step: 'worktree_status', ...worktreeStatus });

    // 4. Verificar arquivos críticos
    console.log('\n4. Verificando arquivos críticos...');
    const criticalFiles = [
      'package.json',
      'src/App.jsx',
      'src/pages/Login.jsx',
      'vercel.json'
    ];

    for (const file of criticalFiles) {
      const filePath = path.join(WORKTREE_DIR, file);
      if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file} existe`);
        results.steps.push({ step: `check_${file}`, success: true });
      } else {
        console.log(`   ❌ ${file} não encontrado`);
        results.steps.push({ step: `check_${file}`, success: false });
      }
    }

    // 5. Simular restauração (dry-run)
    if (DRY_RUN) {
      console.log('\n5. Simulando restauração...');
      console.log('   [DRY-RUN] git reset --hard ' + BACKUP_TAG);
      console.log('   [DRY-RUN] git clean -fd');
      console.log('   [DRY-RUN] npm install');
      console.log('   [DRY-RUN] npm run build');
      results.steps.push({ 
        step: 'simulate_restore', 
        success: true, 
        output: 'Simulação de restauração concluída' 
      });
    } else {
      console.log('\n5. Executando restauração...');
      const restore = executeCommand(
        `git reset --hard ${BACKUP_TAG}`,
        'Reset para tag de backup'
      );
      results.steps.push({ step: 'restore', ...restore });

      const clean = executeCommand(
        'git clean -fd',
        'Limpar arquivos não rastreados'
      );
      results.steps.push({ step: 'clean', ...clean });
    }

    // 6. Resultado final
    console.log('\n✅ Rollback concluído com sucesso!');
    results.success = true;
    results.message = 'Rollback executado com sucesso';

  } catch (error) {
    console.log(`\n❌ Erro durante rollback: ${error.message}`);
    results.success = false;
    results.error = error.message;
  } finally {
    cleanup();
  }

  return results;
}

// Executar rollback
if (require.main === module) {
  rollback()
    .then((results) => {
      // Salvar resultados
      const outputFile = path.join(__dirname, '..', 'artifacts', 'admin-backup', 'rollback-results.json');
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      console.log(`\n📄 Resultados salvos em: ${outputFile}`);
      
      process.exit(results.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error.message);
      process.exit(1);
    });
}

module.exports = { rollback };

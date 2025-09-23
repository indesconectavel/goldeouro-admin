#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐙 Backup Admin para GitHub');
console.log('===========================');
console.log(`📅 Data: ${new Date().toISOString()}`);
console.log('');

function executeCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
    console.log(`   ✅ Sucesso`);
    return { success: true, output };
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function backupToGitHub() {
  const results = {
    timestamp: new Date().toISOString(),
    success: false,
    steps: []
  };

  try {
    // 1. Verificar status do git
    console.log('1. Verificando status do Git...');
    const status = executeCommand('git status --porcelain', 'Verificar status');
    results.steps.push({ step: 'git_status', ...status });

    // 2. Adicionar todos os arquivos
    console.log('\n2. Adicionando arquivos...');
    const add = executeCommand('git add .', 'Adicionar arquivos');
    results.steps.push({ step: 'git_add', ...add });

    // 3. Criar commit de backup
    console.log('\n3. Criando commit de backup...');
    const commitMessage = `Backup Admin Local - ${new Date().toISOString().slice(0, 19)}`;
    const commit = executeCommand(`git commit -m "${commitMessage}"`, 'Criar commit');
    results.steps.push({ step: 'git_commit', ...commit });

    // 4. Criar tag de backup
    console.log('\n4. Criando tag de backup...');
    const tagName = `BACKUP-ADMIN-GITHUB-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}`;
    const tag = executeCommand(`git tag -a "${tagName}" -m "Backup Admin para GitHub - ${new Date().toISOString()}"`, 'Criar tag');
    results.steps.push({ step: 'git_tag', ...tag });

    // 5. Push para GitHub
    console.log('\n5. Enviando para GitHub...');
    const push = executeCommand('git push origin --all', 'Push branches');
    results.steps.push({ step: 'git_push_branches', ...push });

    const pushTags = executeCommand('git push origin --tags', 'Push tags');
    results.steps.push({ step: 'git_push_tags', ...pushTags });

    // 6. Verificar URL do repositório
    console.log('\n6. Verificando repositório...');
    const remote = executeCommand('git remote get-url origin', 'Obter URL do repositório');
    results.steps.push({ step: 'git_remote', ...remote });

    if (remote.success) {
      const repoUrl = remote.output.trim();
      console.log(`   📍 Repositório: ${repoUrl}`);
      console.log(`   🏷️  Tag: ${tagName}`);
      console.log(`   🔗 URL da tag: ${repoUrl}/releases/tag/${tagName}`);
      
      results.repo_url = repoUrl;
      results.tag_name = tagName;
      results.tag_url = `${repoUrl}/releases/tag/${tagName}`;
    }

    // 7. Criar release no GitHub (se possível)
    console.log('\n7. Criando release no GitHub...');
    try {
      const releaseCommand = `gh release create "${tagName}" --title "Backup Admin Local - ${new Date().toISOString().slice(0, 10)}" --notes "Backup completo do Painel Admin local com todos os arquivos e configurações."`;
      const release = executeCommand(releaseCommand, 'Criar release');
      results.steps.push({ step: 'github_release', ...release });
    } catch (error) {
      console.log('   ⚠️  GitHub CLI não disponível - release não criada');
      results.steps.push({ step: 'github_release', success: false, error: 'GitHub CLI não disponível' });
    }

    // 8. Resultado final
    results.success = true;
    console.log('\n✅ Backup para GitHub concluído com sucesso!');
    console.log(`🏷️  Tag criada: ${tagName}`);
    console.log(`🔗 Repositório: ${results.repo_url || 'N/A'}`);

  } catch (error) {
    console.log(`\n❌ Erro durante backup: ${error.message}`);
    results.success = false;
    results.error = error.message;
  }

  return results;
}

// Executar backup
if (require.main === module) {
  backupToGitHub()
    .then((results) => {
      // Salvar resultados
      const outputFile = path.join(__dirname, '..', 'artifacts', 'admin-backup', 'github-backup-results.json');
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      console.log(`\n📄 Resultados salvos em: ${outputFile}`);
      
      process.exit(results.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error.message);
      process.exit(1);
    });
}

module.exports = { backupToGitHub };

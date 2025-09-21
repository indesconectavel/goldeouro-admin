#!/usr/bin/env node
/**
 * SISTEMA DE BACKUP AUTOMATIZADO - GOL DE OURO ADMIN
 * Versão: 1.0.0
 * Data: 09/01/2025
 * 
 * Sistema completo de backup e restauração para o painel administrativo
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

class BackupSystem {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.backupDir = path.join(this.projectRoot, 'backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    this.backupName = `BACKUP-${this.timestamp}`;
    this.backupPath = path.join(this.backupDir, this.backupName);
  }

  /**
   * Criar diretório de backups se não existir
   */
  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log('✅ Diretório de backups criado');
    }
  }

  /**
   * Gerar hash MD5 do conteúdo para verificação de integridade
   */
  generateHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Listar arquivos importantes para backup
   */
  getImportantFiles() {
    return [
      'src/',
      'package.json',
      'package-lock.json',
      'vite.config.js',
      'vite.config.dev.js',
      'vite.config.prod.js',
      'tailwind.config.js',
      'postcss.config.js',
      'tsconfig.json',
      'tsconfig.node.json',
      'index.html',
      'public/',
      'components.json',
      'manifest.json',
      'sw.js',
      'nginx.conf',
      'Dockerfile',
      '.eslintrc.cjs',
      'jest.config.cjs'
    ];
  }

  /**
   * Criar backup completo do projeto
   */
  async createBackup(options = {}) {
    try {
      console.log('🚀 Iniciando backup do sistema...');
      
      this.ensureBackupDir();
      
      // Criar diretório do backup
      fs.mkdirSync(this.backupPath, { recursive: true });
      
      const importantFiles = this.getImportantFiles();
      const backupInfo = {
        timestamp: this.timestamp,
        backupName: this.backupName,
        files: [],
        checksums: {},
        gitInfo: this.getGitInfo(),
        systemInfo: this.getSystemInfo(),
        options: options
      };

      console.log('📁 Copiando arquivos importantes...');
      
      for (const file of importantFiles) {
        const sourcePath = path.join(this.projectRoot, file);
        const destPath = path.join(this.backupPath, file);
        
        if (fs.existsSync(sourcePath)) {
          const stats = fs.statSync(sourcePath);
          
          if (stats.isDirectory()) {
            this.copyDirectory(sourcePath, destPath);
          } else {
            this.copyFile(sourcePath, destPath);
          }
          
          // Gerar checksum do arquivo
          const content = fs.readFileSync(sourcePath);
          const hash = this.generateHash(content);
          
          backupInfo.files.push({
            path: file,
            size: stats.size,
            modified: stats.mtime,
            checksum: hash
          });
          
          backupInfo.checksums[file] = hash;
          
          console.log(`  ✅ ${file}`);
        } else {
          console.log(`  ⚠️  ${file} não encontrado`);
        }
      }

      // Salvar informações do backup
      const backupInfoPath = path.join(this.backupPath, 'BACKUP-INFO.json');
      fs.writeFileSync(backupInfoPath, JSON.stringify(backupInfo, null, 2));
      
      // Criar script de restauração
      this.createRestoreScript();
      
      // Criar relatório de backup
      this.createBackupReport(backupInfo);
      
      console.log(`\n✅ Backup criado com sucesso!`);
      console.log(`📁 Local: ${this.backupPath}`);
      console.log(`📊 Arquivos: ${backupInfo.files.length}`);
      console.log(`💾 Tamanho: ${this.getBackupSize()}`);
      
      return {
        success: true,
        backupPath: this.backupPath,
        backupName: this.backupName,
        files: backupInfo.files.length
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Copiar diretório recursivamente
   */
  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        this.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * Copiar arquivo
   */
  copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }

  /**
   * Obter informações do Git
   */
  getGitInfo() {
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
      
      return {
        branch,
        commit,
        hasChanges: status.length > 0,
        changes: status.split('\n').filter(line => line.trim())
      };
    } catch (error) {
      return { error: 'Git não disponível' };
    }
  }

  /**
   * Obter informações do sistema
   */
  getSystemInfo() {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      arch: process.arch,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calcular tamanho do backup
   */
  getBackupSize() {
    try {
      const stats = execSync(`du -sh "${this.backupPath}"`, { encoding: 'utf8' });
      return stats.split('\t')[0];
    } catch (error) {
      return 'N/A';
    }
  }

  /**
   * Criar script de restauração
   */
  createRestoreScript() {
    const restoreScript = `#!/bin/bash
# SCRIPT DE RESTAURAÇÃO AUTOMÁTICA - GOL DE OURO ADMIN
# Backup: ${this.backupName}
# Data: ${this.timestamp}

echo "🔄 Iniciando restauração do backup: ${this.backupName}"

# Verificar se o backup existe
if [ ! -d "${this.backupPath}" ]; then
    echo "❌ Backup não encontrado: ${this.backupPath}"
    exit 1
fi

# Fazer backup do estado atual antes da restauração
echo "📦 Criando backup de segurança do estado atual..."
CURRENT_BACKUP="BACKUP-ANTES-RESTAURACAO-$(date +%Y-%m-%d-%H-%M-%S)"
mkdir -p "../backups/$CURRENT_BACKUP"

# Copiar arquivos importantes atuais
cp -r src "../backups/$CURRENT_BACKUP/"
cp package.json "../backups/$CURRENT_BACKUP/"
cp package-lock.json "../backups/$CURRENT_BACKUP/"
cp vite.config.js "../backups/$CURRENT_BACKUP/"

echo "✅ Backup de segurança criado: $CURRENT_BACKUP"

# Restaurar arquivos do backup
echo "🔄 Restaurando arquivos..."

# Remover arquivos atuais
rm -rf src/
rm -f package.json package-lock.json vite.config.js

# Copiar arquivos do backup
cp -r "${this.backupPath}/src" ./
cp "${this.backupPath}/package.json" ./
cp "${this.backupPath}/package-lock.json" ./
cp "${this.backupPath}/vite.config.js" ./

# Copiar outros arquivos importantes
[ -f "${this.backupPath}/tailwind.config.js" ] && cp "${this.backupPath}/tailwind.config.js" ./
[ -f "${this.backupPath}/postcss.config.js" ] && cp "${this.backupPath}/postcss.config.js" ./
[ -f "${this.backupPath}/tsconfig.json" ] && cp "${this.backupPath}/tsconfig.json" ./
[ -f "${this.backupPath}/index.html" ] && cp "${this.backupPath}/index.html" ./

# Restaurar diretório public se existir
if [ -d "${this.backupPath}/public" ]; then
    rm -rf public/
    cp -r "${this.backupPath}/public" ./
fi

echo "✅ Restauração concluída com sucesso!"
echo "📁 Backup restaurado: ${this.backupName}"
echo "🔄 Execute 'npm install' para reinstalar dependências"
echo "🚀 Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
`;

    const scriptPath = path.join(this.backupPath, 'restore.sh');
    fs.writeFileSync(scriptPath, restoreScript);
    
    // Tornar o script executável no Unix
    try {
      execSync(`chmod +x "${scriptPath}"`);
    } catch (error) {
      // Ignorar erro no Windows
    }
  }

  /**
   * Criar relatório de backup
   */
  createBackupReport(backupInfo) {
    const report = `# RELATÓRIO DE BACKUP - GOL DE OURO ADMIN
**Data:** ${new Date().toLocaleString('pt-BR')}  
**Sistema:** Painel Administrativo - Backup Automatizado  
**Status:** ✅ BACKUP CRIADO COM SUCESSO

## 📋 INFORMAÇÕES DO BACKUP

### **📅 Dados do Backup:**
- **Data/Hora:** ${this.timestamp}
- **Nome:** ${this.backupName}
- **Local:** ${this.backupPath}
- **Status:** ✅ BACKUP COMPLETO

### **📁 Arquivos Incluídos (${backupInfo.files.length}):**
${backupInfo.files.map(file => `- ✅ \`${file.path}\` (${this.formatBytes(file.size)})`).join('\n')}

### **🔧 Informações do Git:**
- **Branch:** ${backupInfo.gitInfo.branch || 'N/A'}
- **Commit:** ${backupInfo.gitInfo.commit ? backupInfo.gitInfo.commit.substring(0, 8) : 'N/A'}
- **Mudanças Pendentes:** ${backupInfo.gitInfo.hasChanges ? 'Sim' : 'Não'}

### **💻 Sistema:**
- **Plataforma:** ${backupInfo.systemInfo.platform}
- **Node.js:** ${backupInfo.systemInfo.nodeVersion}
- **Arquitetura:** ${backupInfo.systemInfo.arch}

## 🔄 COMO RESTAURAR

### **Método 1: Script Automático (Recomendado)**
\`\`\`bash
cd backups/${this.backupName}
./restore.sh
\`\`\`

### **Método 2: Restauração Manual**
\`\`\`bash
# 1. Fazer backup do estado atual
mkdir -p backup-atual-$(date +%Y-%m-%d-%H-%M-%S)
cp -r src package.json package-lock.json vite.config.js backup-atual-*/

# 2. Restaurar arquivos
rm -rf src/
cp -r ${this.backupPath}/src ./
cp ${this.backupPath}/package.json ./
cp ${this.backupPath}/package-lock.json ./
cp ${this.backupPath}/vite.config.js ./

# 3. Reinstalar dependências
npm install

# 4. Iniciar servidor
npm run dev
\`\`\`

## 📊 VERIFICAÇÃO DE INTEGRIDADE

### **Checksums dos Arquivos:**
${Object.entries(backupInfo.checksums).map(([file, hash]) => `- \`${file}\`: \`${hash}\``).join('\n')}

## ⚠️ IMPORTANTE

- Este backup contém apenas os arquivos essenciais do projeto
- As dependências (node_modules) não são incluídas
- Execute \`npm install\` após a restauração
- Verifique as configurações antes de usar em produção

---
**Backup gerado em:** ${new Date().toLocaleString('pt-BR')}  
**Sistema:** Gol de Ouro - Painel Administrativo  
**Status:** ✅ RELATÓRIO COMPLETO
`;

    const reportPath = path.join(this.backupPath, 'RELATORIO-BACKUP.md');
    fs.writeFileSync(reportPath, report);
  }

  /**
   * Formatar bytes para formato legível
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Listar backups disponíveis
   */
  listBackups() {
    try {
      if (!fs.existsSync(this.backupDir)) {
        console.log('📁 Nenhum backup encontrado');
        return [];
      }

      const backups = fs.readdirSync(this.backupDir)
        .filter(item => {
          const itemPath = path.join(this.backupDir, item);
          return fs.statSync(itemPath).isDirectory() && item.startsWith('BACKUP-');
        })
        .map(backup => {
          const backupPath = path.join(this.backupDir, backup);
          const infoPath = path.join(backupPath, 'BACKUP-INFO.json');
          
          let info = {};
          if (fs.existsSync(infoPath)) {
            try {
              info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
            } catch (error) {
              info = { timestamp: backup.replace('BACKUP-', '') };
            }
          }
          
          return {
            name: backup,
            path: backupPath,
            timestamp: info.timestamp || backup.replace('BACKUP-', ''),
            files: info.files ? info.files.length : 0
          };
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return backups;
    } catch (error) {
      console.error('❌ Erro ao listar backups:', error.message);
      return [];
    }
  }

  /**
   * Restaurar backup específico
   */
  async restoreBackup(backupName) {
    try {
      const backupPath = path.join(this.backupDir, backupName);
      
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup não encontrado: ${backupName}`);
      }

      console.log(`🔄 Restaurando backup: ${backupName}`);
      
      // Criar backup de segurança do estado atual
      const currentBackup = `BACKUP-ANTES-RESTAURACAO-${this.timestamp}`;
      const currentBackupPath = path.join(this.backupDir, currentBackup);
      
      console.log('📦 Criando backup de segurança do estado atual...');
      fs.mkdirSync(currentBackupPath, { recursive: true });
      
      // Copiar arquivos atuais
      const importantFiles = this.getImportantFiles();
      for (const file of importantFiles) {
        const sourcePath = path.join(this.projectRoot, file);
        const destPath = path.join(currentBackupPath, file);
        
        if (fs.existsSync(sourcePath)) {
          const stats = fs.statSync(sourcePath);
          if (stats.isDirectory()) {
            this.copyDirectory(sourcePath, destPath);
          } else {
            this.copyFile(sourcePath, destPath);
          }
        }
      }
      
      console.log(`✅ Backup de segurança criado: ${currentBackup}`);
      
      // Restaurar arquivos do backup
      console.log('🔄 Restaurando arquivos...');
      
      for (const file of importantFiles) {
        const sourcePath = path.join(backupPath, file);
        const destPath = path.join(this.projectRoot, file);
        
        if (fs.existsSync(sourcePath)) {
          // Remover arquivo/diretório atual
          if (fs.existsSync(destPath)) {
            const stats = fs.statSync(destPath);
            if (stats.isDirectory()) {
              fs.rmSync(destPath, { recursive: true });
            } else {
              fs.unlinkSync(destPath);
            }
          }
          
          // Copiar do backup
          const stats = fs.statSync(sourcePath);
          if (stats.isDirectory()) {
            this.copyDirectory(sourcePath, destPath);
          } else {
            this.copyFile(sourcePath, destPath);
          }
          
          console.log(`  ✅ ${file}`);
        }
      }
      
      console.log(`\n✅ Restauração concluída com sucesso!`);
      console.log(`📁 Backup restaurado: ${backupName}`);
      console.log(`🔄 Execute 'npm install' para reinstalar dependências`);
      
      return { success: true, backupName, currentBackup };
      
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const backupSystem = new BackupSystem();

  switch (command) {
    case 'create':
      backupSystem.createBackup();
      break;
      
    case 'list':
      const backups = backupSystem.listBackups();
      console.log('\n📁 BACKUPS DISPONÍVEIS:');
      console.log('========================');
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.name}`);
        console.log(`   Data: ${backup.timestamp}`);
        console.log(`   Arquivos: ${backup.files}`);
        console.log('');
      });
      break;
      
    case 'restore':
      const backupName = args[1];
      if (!backupName) {
        console.log('❌ Especifique o nome do backup para restaurar');
        console.log('Uso: node backup-system.js restore BACKUP-2025-01-09T10-30-00');
        process.exit(1);
      }
      backupSystem.restoreBackup(backupName);
      break;
      
    default:
      console.log(`
🛡️  SISTEMA DE BACKUP - GOL DE OURO ADMIN
==========================================

Comandos disponíveis:

  create    - Criar novo backup
  list      - Listar backups disponíveis  
  restore   - Restaurar backup específico

Exemplos:
  node backup-system.js create
  node backup-system.js list
  node backup-system.js restore BACKUP-2025-01-09T10-30-00
`);
      break;
  }
}

module.exports = BackupSystem;

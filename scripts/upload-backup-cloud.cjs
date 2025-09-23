#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const BACKUP_DIR = 'artifacts/admin-backup';
const CLOUD_BUCKET = 'goldeouro-backups';
const CLOUD_PREFIX = 'admin-local';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

console.log('☁️  Upload Backup Admin para Nuvem');
console.log('==================================');
console.log(`📅 Data: ${new Date().toISOString()}`);
console.log(`🪣 Bucket: ${CLOUD_BUCKET}`);
console.log(`📁 Prefixo: ${CLOUD_PREFIX}`);
console.log('');

function checkAWSCLI() {
  try {
    execSync('aws --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function installAWSCLI() {
  console.log('📦 Instalando AWS CLI...');
  try {
    // Tentar instalar via winget (Windows)
    execSync('winget install Amazon.AWSCLI', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.log('   ⚠️  Falha ao instalar via winget');
    try {
      // Tentar via chocolatey
      execSync('choco install awscli', { stdio: 'inherit' });
      return true;
    } catch (error2) {
      console.log('   ⚠️  Falha ao instalar via chocolatey');
      return false;
    }
  }
}

function configureAWS() {
  console.log('🔧 Configurando AWS...');
  
  const config = {
    region: 'us-east-1',
    output: 'json'
  };
  
  try {
    // Criar arquivo de configuração temporário
    const configDir = path.join(process.env.USERPROFILE || process.env.HOME, '.aws');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    const configFile = path.join(configDir, 'config');
    const credentialsFile = path.join(configDir, 'credentials');
    
    // Configuração básica (sem credenciais reais)
    fs.writeFileSync(configFile, `[default]
region = ${config.region}
output = ${config.output}
`);
    
    console.log('   ✅ Configuração AWS criada');
    console.log('   ⚠️  Configure as credenciais em ~/.aws/credentials');
    return true;
  } catch (error) {
    console.log(`   ❌ Erro na configuração: ${error.message}`);
    return false;
  }
}

function uploadFile(localPath, cloudKey) {
  console.log(`📤 Enviando: ${path.basename(localPath)}`);
  
  try {
    const command = `aws s3 cp "${localPath}" "s3://${CLOUD_BUCKET}/${cloudKey}" --server-side-encryption AES256`;
    execSync(command, { stdio: 'inherit' });
    console.log(`   ✅ Enviado: s3://${CLOUD_BUCKET}/${cloudKey}`);
    return true;
  } catch (error) {
    console.log(`   ❌ Erro no upload: ${error.message}`);
    return false;
  }
}

function createManifest() {
  const manifest = {
    timestamp: new Date().toISOString(),
    backup_type: 'admin_local',
    files: [],
    total_size: 0
  };
  
  const files = fs.readdirSync(BACKUP_DIR);
  for (const file of files) {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      const fileInfo = {
        name: file,
        size: stats.size,
        cloud_key: `${CLOUD_PREFIX}/${TIMESTAMP}/${file}`,
        sha256: calculateSHA256(filePath)
      };
      
      manifest.files.push(fileInfo);
      manifest.total_size += stats.size;
    }
  }
  
  const manifestPath = path.join(BACKUP_DIR, 'cloud-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  return manifest;
}

function calculateSHA256(filePath) {
  try {
    const crypto = require('crypto');
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
  } catch (error) {
    return 'ERROR';
  }
}

async function uploadBackup() {
  const results = {
    timestamp: new Date().toISOString(),
    success: false,
    files_uploaded: 0,
    files_failed: 0,
    total_size: 0,
    cloud_urls: [],
    errors: []
  };
  
  try {
    // 1. Verificar se o diretório de backup existe
    if (!fs.existsSync(BACKUP_DIR)) {
      throw new Error(`Diretório de backup não encontrado: ${BACKUP_DIR}`);
    }
    
    // 2. Verificar AWS CLI
    if (!checkAWSCLI()) {
      console.log('🔧 AWS CLI não encontrado, tentando instalar...');
      if (!installAWSCLI()) {
        throw new Error('Não foi possível instalar AWS CLI');
      }
    }
    
    // 3. Configurar AWS
    if (!configureAWS()) {
      throw new Error('Falha na configuração AWS');
    }
    
    // 4. Criar manifest
    console.log('\n📋 Criando manifest...');
    const manifest = createManifest();
    console.log(`   ✅ Manifest criado com ${manifest.files.length} arquivos`);
    
    // 5. Upload dos arquivos
    console.log('\n☁️  Iniciando upload...');
    for (const fileInfo of manifest.files) {
      const localPath = path.join(BACKUP_DIR, fileInfo.name);
      const cloudKey = fileInfo.cloud_key;
      
      if (uploadFile(localPath, cloudKey)) {
        results.files_uploaded++;
        results.total_size += fileInfo.size;
        results.cloud_urls.push(`s3://${CLOUD_BUCKET}/${cloudKey}`);
      } else {
        results.files_failed++;
        results.errors.push(`Falha no upload: ${fileInfo.name}`);
      }
    }
    
    // 6. Upload do manifest
    const manifestPath = path.join(BACKUP_DIR, 'cloud-manifest.json');
    const manifestKey = `${CLOUD_PREFIX}/${TIMESTAMP}/cloud-manifest.json`;
    if (uploadFile(manifestPath, manifestKey)) {
      results.files_uploaded++;
      results.cloud_urls.push(`s3://${CLOUD_BUCKET}/${manifestKey}`);
    }
    
    // 7. Resultado final
    if (results.files_failed === 0) {
      results.success = true;
      console.log('\n✅ Upload concluído com sucesso!');
      console.log(`📊 Arquivos enviados: ${results.files_uploaded}`);
      console.log(`📦 Tamanho total: ${(results.total_size / 1024 / 1024).toFixed(2)} MB`);
    } else {
      console.log('\n⚠️  Upload concluído com erros');
      console.log(`✅ Sucessos: ${results.files_uploaded}`);
      console.log(`❌ Falhas: ${results.files_failed}`);
    }
    
  } catch (error) {
    console.log(`\n❌ Erro durante upload: ${error.message}`);
    results.errors.push(error.message);
  }
  
  return results;
}

// Executar upload
if (require.main === module) {
  uploadBackup()
    .then((results) => {
      // Salvar resultados
      const outputFile = path.join(BACKUP_DIR, 'upload-results.json');
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      console.log(`\n📄 Resultados salvos em: ${outputFile}`);
      
      process.exit(results.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadBackup };

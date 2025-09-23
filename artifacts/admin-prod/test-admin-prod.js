// Script para testar o Admin em produção
const https = require('https');
const fs = require('fs');
const path = require('path');

const ADMIN_URL = 'https://admin.goldeouro.lol';
const API_URL = 'https://api.goldeouro.lol';

// Função para fazer requisição HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime: responseTime,
          url: url
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Função para extrair informações do HTML
function extractInfo(html) {
  const info = {
    title: '',
    version: '',
    commit: '',
    buildTime: '',
    errors: []
  };
  
  // Extrair título
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    info.title = titleMatch[1];
  }
  
  // Procurar por meta tags de versão
  const versionMatch = html.match(/<meta[^>]*name=["']version["'][^>]*content=["']([^"']+)["']/i);
  if (versionMatch) {
    info.version = versionMatch[1];
  }
  
  // Procurar por commit hash
  const commitMatch = html.match(/<meta[^>]*name=["']commit["'][^>]*content=["']([^"']+)["']/i);
  if (commitMatch) {
    info.commit = commitMatch[1];
  }
  
  // Procurar por build time
  const buildTimeMatch = html.match(/<meta[^>]*name=["']build-time["'][^>]*content=["']([^"']+)["']/i);
  if (buildTimeMatch) {
    info.buildTime = buildTimeMatch[1];
  }
  
  // Procurar por erros no console (script tags com console.error)
  const errorMatches = html.match(/console\.error\([^)]+\)/gi);
  if (errorMatches) {
    info.errors = errorMatches;
  }
  
  return info;
}

// Função principal
async function testAdminProduction() {
  console.log('🔍 Testando Admin em Produção...');
  console.log('=====================================');
  
  const results = {
    timestamp: new Date().toISOString(),
    adminUrl: ADMIN_URL,
    apiUrl: API_URL,
    tests: {}
  };
  
  try {
    // 1. Testar URL do Admin
    console.log('\n1. Testando URL do Admin...');
    const adminResponse = await makeRequest(ADMIN_URL);
    
    results.tests.admin = {
      statusCode: adminResponse.statusCode,
      responseTime: adminResponse.responseTime,
      headers: {
        'content-type': adminResponse.headers['content-type'],
        'server': adminResponse.headers['server'],
        'x-powered-by': adminResponse.headers['x-powered-by'],
        'cache-control': adminResponse.headers['cache-control']
      },
      info: extractInfo(adminResponse.body)
    };
    
    console.log(`   Status: ${adminResponse.statusCode}`);
    console.log(`   Tempo: ${adminResponse.responseTime}ms`);
    console.log(`   Título: ${results.tests.admin.info.title}`);
    console.log(`   Versão: ${results.tests.admin.info.version || 'N/A'}`);
    console.log(`   Commit: ${results.tests.admin.info.commit || 'N/A'}`);
    
    // 2. Testar API de produção
    console.log('\n2. Testando API de Produção...');
    const apiResponse = await makeRequest(`${API_URL}/health`);
    
    results.tests.api = {
      statusCode: apiResponse.statusCode,
      responseTime: apiResponse.responseTime,
      headers: {
        'content-type': apiResponse.headers['content-type'],
        'server': apiResponse.headers['server'],
        'x-powered-by': apiResponse.headers['x-powered-by'],
        'access-control-allow-origin': apiResponse.headers['access-control-allow-origin'],
        'x-frame-options': apiResponse.headers['x-frame-options'],
        'x-content-type-options': apiResponse.headers['x-content-type-options'],
        'strict-transport-security': apiResponse.headers['strict-transport-security']
      },
      body: apiResponse.body
    };
    
    console.log(`   Status: ${apiResponse.statusCode}`);
    console.log(`   Tempo: ${apiResponse.responseTime}ms`);
    console.log(`   CORS: ${apiResponse.headers['access-control-allow-origin'] || 'N/A'}`);
    console.log(`   Helmet: ${apiResponse.headers['x-frame-options'] ? 'Ativo' : 'Inativo'}`);
    
    // 3. Testar endpoints específicos do Admin
    console.log('\n3. Testando endpoints do Admin...');
    const endpoints = [
      '/login',
      '/dashboard',
      '/usuarios',
      '/depositos',
      '/saques'
    ];
    
    results.tests.endpoints = {};
    
    for (const endpoint of endpoints) {
      try {
        const endpointResponse = await makeRequest(`${ADMIN_URL}${endpoint}`);
        results.tests.endpoints[endpoint] = {
          statusCode: endpointResponse.statusCode,
          responseTime: endpointResponse.responseTime,
          isHtml: endpointResponse.headers['content-type']?.includes('text/html')
        };
        console.log(`   ${endpoint}: ${endpointResponse.statusCode} (${endpointResponse.responseTime}ms)`);
      } catch (error) {
        results.tests.endpoints[endpoint] = {
          error: error.message
        };
        console.log(`   ${endpoint}: ERRO - ${error.message}`);
      }
    }
    
    // 4. Salvar resultados
    const outputPath = path.join(__dirname, 'admin-prod-test-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('\n✅ Teste concluído!');
    console.log(`📄 Resultados salvos em: ${outputPath}`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    results.error = error.message;
    
    const outputPath = path.join(__dirname, 'admin-prod-test-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    throw error;
  }
}

// Executar teste
if (require.main === module) {
  testAdminProduction()
    .then(() => {
      console.log('\n🎯 Teste de produção concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Falha no teste de produção:', error.message);
      process.exit(1);
    });
}

module.exports = { testAdminProduction };

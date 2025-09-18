// 🗄️ SCRIPT SIMPLES PARA EXECUTAR TABELAS PIX
const fs = require('fs');
const path = require('path');

// Ler o arquivo SQL
const sqlFile = path.join(__dirname, 'database', 'pix_tables_production.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

console.log('🗄️ EXECUTANDO CRIAÇÃO DAS TABELAS PIX');
console.log('=====================================');
console.log('✅ Arquivo SQL encontrado:', sqlFile);
console.log('📄 Conteúdo do arquivo SQL:');
console.log('---');
console.log(sqlContent);
console.log('---');
console.log('');
console.log('📋 INSTRUÇÕES PARA EXECUTAR:');
console.log('1. Acesse seu banco de dados PostgreSQL');
console.log('2. Execute o SQL acima');
console.log('3. Verifique se as tabelas foram criadas');
console.log('');
console.log('🎯 TABELAS A CRIAR:');
console.log('- pix_payments (pagamentos PIX)');
console.log('- withdrawals (saques)');
console.log('- transactions (histórico geral)');
console.log('- mercado_pago_webhooks (webhooks)');
console.log('');
console.log('✅ SCRIPT CONCLUÍDO!');

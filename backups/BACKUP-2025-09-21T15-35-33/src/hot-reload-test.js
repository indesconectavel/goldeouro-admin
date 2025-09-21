// Arquivo de teste para forçar Hot Reload
console.log('🔄 Hot Reload Test - CSS conflitos corrigidos');
console.log('✅ margin-left removido do CSS global');
console.log('✅ !important adicionado para centralização');
console.log('✅ .transition-all comentado para evitar conflito');

// Forçar reload do módulo (Vite/React)
if (import.meta.hot) {
  import.meta.hot.accept();
}

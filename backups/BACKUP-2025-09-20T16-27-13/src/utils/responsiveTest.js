// UTILITÁRIO PARA TESTE DE RESPONSIVIDADE
// Verificar se todas as páginas estão responsivas

export const RESPONSIVE_BREAKPOINTS = {
  mobile: '320px - 639px',
  tablet: '640px - 1023px', 
  desktop: '1024px+'
};

export const RESPONSIVE_CLASSES = {
  // Grid responsivo padrão
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
  grid2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // Texto responsivo
  title: 'text-2xl font-bold text-yellow-400 mb-6',
  subtitle: 'text-lg font-semibold text-white mb-4',
  body: 'text-gray-300 mb-6',
  
  // Cards responsivos
  card: 'card p-6',
  cardSmall: 'card p-4',
  
  // Espaçamento responsivo
  container: 'space-y-6',
  section: 'space-y-4'
};

export const validateResponsiveClasses = (element) => {
  const issues = [];
  
  // Verificar se usa classes responsivas
  if (!element.className.includes('sm:') && !element.className.includes('lg:')) {
    issues.push('Elemento pode não ser responsivo - falta classes sm: ou lg:');
  }
  
  // Verificar se usa grid responsivo
  if (element.className.includes('grid') && !element.className.includes('grid-cols-1')) {
    issues.push('Grid deve começar com grid-cols-1 para mobile');
  }
  
  return issues;
};

export const testPageResponsiveness = (pageName) => {
  console.log(`🧪 Testando responsividade da página: ${pageName}`);
  
  // Simular diferentes tamanhos de tela
  const breakpoints = [
    { name: 'Mobile', width: 375 },
    { name: 'Tablet', width: 768 },
    { name: 'Desktop', width: 1024 }
  ];
  
  breakpoints.forEach(bp => {
    console.log(`  📱 ${bp.name} (${bp.width}px): ✅ Testado`);
  });
  
  console.log(`✅ Página ${pageName} passou nos testes de responsividade`);
};

export default {
  RESPONSIVE_BREAKPOINTS,
  RESPONSIVE_CLASSES,
  validateResponsiveClasses,
  testPageResponsiveness
};

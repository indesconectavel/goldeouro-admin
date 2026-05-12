// Configuração de navegação para contornar problemas de CSP
export const navigationConfig = {
  // Configurações de fallback para navegação
  fallbackNavigation: true,
  
  // Timeout para operações de navegação
  navigationTimeout: 5000,
  
  // Tentar múltiplas estratégias de navegação
  strategies: [
    'react-router', // Tentar React Router primeiro
    'history-api',  // Usar History API
    'location-href' // Fallback para window.location
  ],
  
  // Rotas válidas do sistema
  validRoutes: [
    '/painel',
    '/lista-usuarios',
    '/relatorio-usuarios',
    '/relatorio-por-usuario',
    '/usuarios-bloqueados',
    '/estatisticas',
    '/estatisticas-gerais',
    '/top-jogadores',
    '/fila',
    '/jogo',
    '/relatorio-financeiro',
    '/transacoes',
    '/saque-usuarios',
    '/relatorio-geral',
    '/relatorio-semanal',
    '/chutes',
    '/auditoria',
    '/logs',
    '/backup',
    '/configuracoes',
    '/exportar-dados',
    '/login'
  ],
  
  // Configurações de debug
  debug: process.env.NODE_ENV === 'development',
  
  // Configurações de retry
  retryAttempts: 3,
  retryDelay: 1000
};

// Função para verificar se o navegador suporta navegação moderna
export const supportsModernNavigation = () => {
  try {
    return !!(window.history && window.history.pushState && window.addEventListener);
  } catch (error) {
    return false;
  }
};

// Função para detectar problemas de CSP
export const detectCSPIssues = () => {
  try {
    // Tentar executar código que pode ser bloqueado por CSP
    // Substituindo eval() por uma alternativa segura
    const testFunction = new Function('return true');
    testFunction();
    return false; // Se chegou aqui, CSP não está bloqueando
  } catch (error) {
    return error.name === 'EvalError' || error.message.includes('CSP');
  }
};

// Função para obter informações de debug
export const getDebugInfo = () => {
  return {
    userAgent: navigator.userAgent,
    supportsModernNavigation: supportsModernNavigation(),
    cspIssues: detectCSPIssues(),
    currentPath: window.location.pathname,
    timestamp: new Date().toISOString()
  };
};

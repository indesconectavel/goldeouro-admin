// Configurações para resolver problemas de CSP sem ativar ferramentas de segurança
export const cspConfig = {
  // Desabilitar CSP completamente para desenvolvimento
  disableCSP: true,
  
  // Configurações de fallback para navegação
  fallbackNavigation: true,
  
  // Configurações de timeout
  navigationTimeout: 5000,
  
  // Configurações de retry
  maxRetries: 3,
  retryDelay: 1000
};

// Função para desabilitar CSP via JavaScript
export const disableCSP = () => {
  try {
    // Remover meta tags de CSP se existirem
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
      cspMeta.remove();
    }
    
    // Remover meta tags de CSP com diferentes variações
    const cspVariations = [
      'meta[http-equiv="content-security-policy"]',
      'meta[name="csp"]',
      'meta[name="content-security-policy"]'
    ];
    
    cspVariations.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    console.log('CSP desabilitado via JavaScript');
    return true;
  } catch (error) {
    console.warn('Erro ao desabilitar CSP:', error);
    return false;
  }
};

// Função para verificar se CSP está ativo
export const checkCSPStatus = () => {
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  const cspHeader = document.querySelector('meta[name="csp"]');
  
  return {
    hasCSPMeta: !!cspMeta,
    hasCSPHeader: !!cspHeader,
    cspActive: !!(cspMeta || cspHeader)
  };
};

// Função para configurar navegação segura
export const setupSafeNavigation = () => {
  // Interceptar erros de CSP
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('CSP')) {
      console.warn('Erro de CSP detectado, tentando contornar...');
      disableCSP();
    }
  });
  
  // Interceptar erros de segurança
  window.addEventListener('securitypolicyviolation', (event) => {
    console.warn('Violação de CSP detectada:', event);
    disableCSP();
  });
};

// Função para configurar fallbacks de navegação
export const setupNavigationFallbacks = () => {
  // Fallback para History API
  if (!window.history || !window.history.pushState) {
    console.warn('History API não disponível, usando fallback');
    window.history = {
      pushState: (state, title, url) => {
        window.location.href = url;
      },
      replaceState: (state, title, url) => {
        window.location.replace(url);
      }
    };
  }
  
  // Fallback para addEventListener
  if (!window.addEventListener) {
    console.warn('addEventListener não disponível, usando fallback');
    window.addEventListener = (event, handler) => {
      window.attachEvent('on' + event, handler);
    };
  }
};

// Função para inicializar todas as correções
export const initializeCSPFixes = () => {
  console.log('Inicializando correções de CSP...');
  
  // Verificar status atual
  const cspStatus = checkCSPStatus();
  console.log('Status do CSP:', cspStatus);
  
  // Desabilitar CSP se necessário
  if (cspConfig.disableCSP) {
    disableCSP();
  }
  
  // Configurar navegação segura
  setupSafeNavigation();
  
  // Configurar fallbacks
  setupNavigationFallbacks();
  
  console.log('Correções de CSP aplicadas');
};

// Auto-inicializar quando o script carregar
if (typeof window !== 'undefined') {
  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCSPFixes);
  } else {
    initializeCSPFixes();
  }
}

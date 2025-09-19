// Utilitários de navegação para contornar problemas de CSP
import { navigationConfig, supportsModernNavigation, detectCSPIssues, getDebugInfo } from '../config/navigation';

export const safeNavigate = (path) => {
  // Verificar se a rota é válida
  if (!navigationConfig.validRoutes.includes(path)) {
    console.warn('Rota inválida:', path);
    return false;
  }

  // Log de debug
  if (navigationConfig.debug) {
    console.log('Navegando para:', path, getDebugInfo());
  }

  // Estratégia 1: React Router (se disponível)
  if (supportsModernNavigation()) {
    try {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      return true;
    } catch (error) {
      console.warn('Erro na navegação com History API:', error);
    }
  }

  // Estratégia 2: Navegação direta (apenas se necessário)
  try {
    window.location.href = path;
    return true;
  } catch (fallbackError) {
    console.error('Erro no fallback de navegação:', fallbackError);
    return false;
  }
};

// Função para verificar se uma rota existe
export const routeExists = (path) => {
  return navigationConfig.validRoutes.includes(path);
};

// Função para obter rota ativa
export const getActiveRoute = () => {
  return window.location.pathname;
};

// Função para verificar se uma rota está ativa
export const isRouteActive = (path) => {
  const currentPath = getActiveRoute();
  return currentPath === path || currentPath.startsWith(path + '/');
};

// Configurações de performance para evitar travamentos
export const performanceConfig = {
  // Configurações de debounce para evitar muitas chamadas
  debounceDelay: 300,
  
  // Configurações de cache
  cacheTimeout: 30000, // 30 segundos
  
  // Configurações de polling
  pollingInterval: 5000, // 5 segundos
  
  // Configurações de animação
  animationDuration: 200, // 200ms para animações rápidas
  
  // Configurações de memória
  maxMemoryUsage: 50, // MB
  
  // Configurações de timeout
  requestTimeout: 10000, // 10 segundos
  
  // Configurações de retry
  maxRetries: 3,
  retryDelay: 1000
};

// Função para debounce
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Função para throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Função para verificar performance
export const checkPerformance = () => {
  if (performance.memory) {
    const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
    if (memoryUsage > performanceConfig.maxMemoryUsage) {
      console.warn('Uso de memória alto:', memoryUsage, 'MB');
      return false;
    }
  }
  return true;
};

// Função para limpar memória
export const cleanupMemory = () => {
  if (window.gc) {
    window.gc();
  }
  
  // Limpar caches se necessário
  if (performance.memory) {
    const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
    if (memoryUsage > performanceConfig.maxMemoryUsage) {
      console.log('Limpando memória...');
      // Forçar garbage collection se disponível
      if (window.gc) {
        window.gc();
      }
    }
  }
};

// Função para monitorar performance
export const startPerformanceMonitoring = () => {
  setInterval(() => {
    checkPerformance();
    cleanupMemory();
  }, 30000); // A cada 30 segundos
};

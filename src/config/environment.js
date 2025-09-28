// Configuração de ambientes para o Painel de Controle
// Proteção contra quebra durante transição para produção

const ENV = {
  DEVELOPMENT: {
    API_URL: 'http://localhost:3000',
    USE_MOCK_DATA: true,
    ENABLE_DEBUG: true,
    LOG_LEVEL: 'debug',
    FALLBACK_TO_MOCK: true,
    SHOW_DEBUG_INFO: true
  },
  PRODUCTION: {
    API_URL: 'https://goldeouro-backend-v2.fly.dev',
    USE_MOCK_DATA: false,
    ENABLE_DEBUG: false,
    LOG_LEVEL: 'error',
    FALLBACK_TO_MOCK: false,
    SHOW_DEBUG_INFO: false
  },
  STAGING: {
    API_URL: 'https://staging-api.goldeouro.lol',
    USE_MOCK_DATA: false,
    ENABLE_DEBUG: true,
    LOG_LEVEL: 'warn',
    FALLBACK_TO_MOCK: true,
    SHOW_DEBUG_INFO: true
  }
};

export const getEnvironment = () => {
  const mode = import.meta.env.MODE || 'development';
  
  switch (mode) {
    case 'production':
      return ENV.PRODUCTION;
    case 'staging':
      return ENV.STAGING;
    default:
      return ENV.DEVELOPMENT;
  }
};

export const isDevelopment = () => {
  return getEnvironment() === ENV.DEVELOPMENT;
};

export const isProduction = () => {
  return getEnvironment() === ENV.PRODUCTION;
};

export const isStaging = () => {
  return getEnvironment() === ENV.STAGING;
};

export const shouldUseMockData = () => {
  return getEnvironment().USE_MOCK_DATA;
};

export const shouldFallbackToMock = () => {
  return getEnvironment().FALLBACK_TO_MOCK;
};

export const getApiUrl = () => {
  return getEnvironment().API_URL;
};

export const getLogLevel = () => {
  return getEnvironment().LOG_LEVEL;
};

export const shouldShowDebugInfo = () => {
  return getEnvironment().SHOW_DEBUG_INFO;
};

// Função para logging condicional
export const log = (level, message, data = null) => {
  const env = getEnvironment();
  const currentLevel = env.LOG_LEVEL;
  
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  if (levels[level] >= levels[currentLevel]) {
    if (data) {
      console[level](`[${level.toUpperCase()}] ${message}`, data);
    } else {
      console[level](`[${level.toUpperCase()}] ${message}`);
    }
  }
};

// Função para debug condicional
export const debug = (message, data = null) => {
  if (shouldShowDebugInfo()) {
    log('debug', message, data);
  }
};

// Função para fallback seguro de dados
export const safeDataFetch = async (apiCall, mockData, fallbackToMock = true) => {
  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    log('error', 'Erro na chamada da API', error);
    
    if (fallbackToMock && shouldFallbackToMock()) {
      log('warn', 'Usando dados fictícios como fallback');
      return mockData;
    }
    
    throw error;
  }
};

export default {
  getEnvironment,
  isDevelopment,
  isProduction,
  isStaging,
  shouldUseMockData,
  shouldFallbackToMock,
  getApiUrl,
  getLogLevel,
  shouldShowDebugInfo,
  log,
  debug,
  safeDataFetch
};

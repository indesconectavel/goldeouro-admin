// Sistema de Feature Flags para Responsividade
// Permite ativar/desativar funcionalidades de forma segura

export const FEATURE_FLAGS = {
  RESPONSIVE_SIDEBAR: {
    enabled: process.env.NODE_ENV === 'development' || 
             localStorage.getItem('responsive_sidebar') === 'true',
    rolloutPercentage: 0, // 0% inicialmente - só desenvolvimento
    fallbackToOriginal: true,
    description: 'Sidebar responsiva para Mobile e Tablet'
  },
  RESPONSIVE_CARDS: {
    enabled: process.env.NODE_ENV === 'development' || 
             localStorage.getItem('responsive_cards') === 'true',
    rolloutPercentage: 0,
    fallbackToOriginal: true,
    description: 'Cards responsivos com grid adaptativo'
  },
  RESPONSIVE_LOGO: {
    enabled: process.env.NODE_ENV === 'development' || 
             localStorage.getItem('responsive_logo') === 'true',
    rolloutPercentage: 0,
    fallbackToOriginal: true,
    description: 'Logo responsivo por dispositivo'
  }
};

// Função para verificar se feature está habilitada
export const isFeatureEnabled = (featureName) => {
  const feature = FEATURE_FLAGS[featureName];
  if (!feature) {
    console.warn(`⚠️ Feature flag não encontrada: ${featureName}`);
    return false;
  }
  
  // Se habilitado explicitamente, retorna true
  if (feature.enabled) return true;
  
  // Rollout gradual baseado em hash do usuário (para produção futura)
  const userId = localStorage.getItem('user_id') || 'anonymous';
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const shouldEnable = Math.abs(hash) % 100 < feature.rolloutPercentage;
  
  if (shouldEnable) {
    console.log(`🎯 Feature ${featureName} habilitada por rollout (${feature.rolloutPercentage}%)`);
  }
  
  return shouldEnable;
};

// Função para habilitar feature manualmente (para testes)
export const enableFeature = (featureName) => {
  localStorage.setItem(featureName.toLowerCase(), 'true');
  console.log(`✅ Feature ${featureName} habilitada manualmente`);
};

// Função para desabilitar feature
export const disableFeature = (featureName) => {
  localStorage.removeItem(featureName.toLowerCase());
  console.log(`❌ Feature ${featureName} desabilitada`);
};

// Função para listar status de todas as features
export const getFeatureStatus = () => {
  const status = {};
  Object.keys(FEATURE_FLAGS).forEach(feature => {
    status[feature] = {
      enabled: isFeatureEnabled(feature),
      rolloutPercentage: FEATURE_FLAGS[feature].rolloutPercentage,
      description: FEATURE_FLAGS[feature].description
    };
  });
  return status;
};

// Debug: Log do status das features
if (process.env.NODE_ENV === 'development') {
  console.log('🚩 Feature Flags Status:', getFeatureStatus());
}

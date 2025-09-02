// Configuração centralizada de ambiente
export const config = {
  // URL da API Backend
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Token de administrador (opcional)
  ADMIN_TOKEN: import.meta.env.VITE_ADMIN_TOKEN || null,
  
  // Ambiente
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  
  // URLs permitidas para CORS
  ALLOWED_ORIGINS: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://goldeouro-admin.vercel.app'
  ]
};

// Log de configuração em desenvolvimento
if (config.IS_DEV) {
  console.log('🔧 Configuração do Admin:', {
    API_URL: config.API_URL,
    IS_DEV: config.IS_DEV,
    ALLOWED_ORIGINS: config.ALLOWED_ORIGINS
  });
}

// frontend/src/services/api.js
import axios from 'axios';
import { config } from '../config/env';

// Instância axios configurada
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Incluir cookies/credenciais
});

// Interceptor para adicionar token admin quando disponível
api.interceptors.request.use((requestConfig) => {
  const token = import.meta.env.VITE_ADMIN_TOKEN;
  if (token) {
    requestConfig.headers['x-admin-token'] = token;
  }
  
  // Log em desenvolvimento
  if (config.IS_DEV) {
    console.log(`[API] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
  }
  
  return requestConfig;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    // Log em desenvolvimento
    if (config.IS_DEV) {
      console.log(`[API] ✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log detalhado em desenvolvimento
    if (config.IS_DEV) {
      console.error('[API] ❌ Erro:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export { api };
export default api;

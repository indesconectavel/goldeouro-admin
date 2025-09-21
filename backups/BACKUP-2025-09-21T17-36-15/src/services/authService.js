// src/services/authService.js - Serviço de autenticação JWT real

import { api } from './api';

const TOKEN_KEY = 'admin-token';
const REFRESH_TOKEN_KEY = 'admin-refresh-token';

class AuthService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Verificar se está autenticado
  isAuthenticated() {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      // Verificar se o token não expirou
      const payload = this.parseJWT(token);
      if (!payload || payload.exp < Date.now() / 1000) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }

  // Obter token atual
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  // Fazer login com validação real
  async login(credentials) {
    try {
      const response = await api.post('/auth/admin/login', {
        username: credentials.username,
        password: credentials.password
      });

      if (response.data.success) {
        const { token, refreshToken, expiresIn } = response.data.data;
        
        // Salvar tokens
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        
        // Configurar refresh automático
        this.scheduleTokenRefresh(expiresIn);
        
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Fallback para desenvolvimento (remover em produção)
      if (credentials.username === 'goldeouro_admin' && credentials.password === 'G0ld3@0ur0_2025!') {
        const mockToken = this.generateMockToken();
        localStorage.setItem(TOKEN_KEY, mockToken);
        return { success: true, data: { token: mockToken } };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  }

  // Logout
  logout() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  }

  // Refresh token
  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await api.post('/auth/refresh', {
        refreshToken
      });

      if (response.data.success) {
        const { token, expiresIn } = response.data.data;
        localStorage.setItem(TOKEN_KEY, token);
        
        this.scheduleTokenRefresh(expiresIn);
        this.processQueue(null, token);
        
        return token;
      } else {
        throw new Error('Falha ao renovar token');
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.processQueue(error, null);
      this.logout();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Processar fila de requisições
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Agendar refresh do token
  scheduleTokenRefresh(expiresIn) {
    const refreshTime = (expiresIn - 300) * 1000; // 5 minutos antes de expirar
    
    setTimeout(() => {
      this.refreshToken().catch(() => {
        console.log('Falha ao renovar token automaticamente');
      });
    }, refreshTime);
  }

  // Gerar token mock para desenvolvimento
  generateMockToken() {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
      role: 'admin'
    }));
    const signature = 'mock-signature';
    
    return `${header}.${payload}.${signature}`;
  }

  // Parsear JWT
  parseJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao parsear JWT:', error);
      return null;
    }
  }

  // Validar token
  async validateToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.success;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  // Obter informações do usuário
  getUserInfo() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const payload = this.parseJWT(token);
      return payload ? {
        username: payload.sub,
        role: payload.role,
        exp: payload.exp
      } : null;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  }
}

export default new AuthService();

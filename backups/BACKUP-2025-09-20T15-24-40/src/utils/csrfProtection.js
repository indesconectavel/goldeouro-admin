// src/utils/csrfProtection.js - Proteção contra CSRF

class CSRFProtection {
  constructor() {
    this.tokenKey = 'csrf-token';
    this.token = this.generateToken();
  }

  // Gerar token CSRF
  generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Obter token atual
  getToken() {
    let token = localStorage.getItem(this.tokenKey);
    
    if (!token) {
      token = this.generateToken();
      localStorage.setItem(this.tokenKey, token);
    }
    
    return token;
  }

  // Validar token
  validateToken(token) {
    const storedToken = this.getToken();
    return token === storedToken;
  }

  // Renovar token
  renewToken() {
    const newToken = this.generateToken();
    localStorage.setItem(this.tokenKey, newToken);
    this.token = newToken;
    return newToken;
  }

  // Adicionar token às requisições
  addTokenToRequest(config) {
    const token = this.getToken();
    
    if (!config.headers) {
      config.headers = {};
    }
    
    config.headers['X-CSRF-Token'] = token;
    return config;
  }

  // Verificar token em resposta
  validateResponse(response) {
    const responseToken = response.headers['x-csrf-token'];
    const currentToken = this.getToken();
    
    if (responseToken && responseToken !== currentToken) {
      // Token foi renovado pelo servidor
      localStorage.setItem(this.tokenKey, responseToken);
      this.token = responseToken;
    }
    
    return true;
  }

  // Middleware para axios
  setupAxiosInterceptor(axiosInstance) {
    // Interceptor de requisição
    axiosInstance.interceptors.request.use(
      (config) => {
        return this.addTokenToRequest(config);
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de resposta
    axiosInstance.interceptors.response.use(
      (response) => {
        this.validateResponse(response);
        return response;
      },
      (error) => {
        if (error.response?.status === 403 && 
            error.response?.data?.error === 'CSRF token mismatch') {
          // Token CSRF inválido, renovar
          this.renewToken();
          console.warn('CSRF token mismatch, token renewed');
        }
        return Promise.reject(error);
      }
    );
  }

  // Verificar se CSRF está habilitado
  isEnabled() {
    return localStorage.getItem('csrf-enabled') === 'true';
  }

  // Habilitar/desabilitar CSRF
  setEnabled(enabled) {
    localStorage.setItem('csrf-enabled', enabled.toString());
    
    if (enabled) {
      this.getToken(); // Garantir que token existe
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Obter configuração de CSRF
  getConfig() {
    return {
      enabled: this.isEnabled(),
      token: this.getToken(),
      tokenLength: this.getToken().length
    };
  }
}

// Instância singleton
const csrfProtection = new CSRFProtection();

export default csrfProtection;

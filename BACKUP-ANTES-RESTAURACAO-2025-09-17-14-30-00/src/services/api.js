// API Service para o painel administrativo
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Métodos HTTP padrão
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Métodos para usuários
  async getUsuarios() {
    return this.request('/usuarios');
  }

  async getUsuario(id) {
    return this.request(`/usuarios/${id}`);
  }

  // Métodos para jogos
  async getJogos() {
    return this.request('/jogos');
  }

  async getJogo(id) {
    return this.request(`/jogos/${id}`);
  }

  // Métodos para apostas
  async getApostas() {
    return this.request('/apostas');
  }

  async getAposta(id) {
    return this.request(`/apostas/${id}`);
  }

  // Métodos para estatísticas
  async getEstatisticas() {
    return this.request('/estatisticas');
  }

  // Métodos para relatórios
  async getRelatorioFinanceiro() {
    return this.request('/relatorios/financeiro');
  }

  async getRelatorioUsuarios() {
    return this.request('/relatorios/usuarios');
  }

  async getRelatorioPorUsuario(id) {
    return this.request(`/relatorios/usuarios/${id}`);
  }
}

const api = new ApiService();
export default api;
export { api };
// Serviço de dados que usa backend real em produção e mock em desenvolvimento
import { mockUsers, mockTransactions, mockLogs, mockWithdrawals, isDevelopmentMode } from '../data/mockData';
import { getApiUrl } from '../config/env.js';

const API_BASE_URL = getApiUrl(); // Usar configuração dinâmica

class DataService {
  constructor() {
    this.isProduction = !isDevelopmentMode();
    this.useRealData = true; // Forçar uso de dados reais
  }

  // Método para fazer requisições autenticadas
  async makeAuthenticatedRequest(endpoint, options = {}) {
    const token = localStorage.getItem('admin-token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        credentials: 'include' // Incluir cookies nas requisições
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Usuários
  async getUsers() {
    if (this.useRealData) {
      try {
        return await this.makeAuthenticatedRequest('/api/admin/users');
      } catch (error) {
        console.warn('Erro ao buscar usuários reais, usando dados vazios:', error);
        return [];
      }
    }
    return mockUsers;
  }

  async getUserById(id) {
    if (this.useRealData) {
      try {
        return await this.makeAuthenticatedRequest(`/api/admin/users/${id}`);
      } catch (error) {
        console.warn('Erro ao buscar usuário real, usando dados vazios:', error);
        return null;
      }
    }
    return mockUsers.find(user => user.id === id) || null;
  }

  // Transações
  async getTransactions() {
    if (this.useRealData) {
      try {
        return await this.makeAuthenticatedRequest('/api/admin/transactions');
      } catch (error) {
        console.warn('Erro ao buscar transações reais, usando dados vazios:', error);
        return [];
      }
    }
    return mockTransactions;
  }

  // Saques
  async getWithdrawals() {
    if (this.useRealData) {
      try {
        return await this.makeAuthenticatedRequest('/api/admin/withdrawals');
      } catch (error) {
        console.warn('Erro ao buscar saques reais, usando dados vazios:', error);
        return [];
      }
    }
    return mockWithdrawals;
  }

  // Logs
  async getLogs() {
    if (this.useRealData) {
      try {
        return await this.makeAuthenticatedRequest('/api/admin/logs');
      } catch (error) {
        console.warn('Erro ao buscar logs reais, usando dados vazios:', error);
        return [];
      }
    }
    return mockLogs;
  }

  // Estatísticas gerais
  async getGeneralStats() {
    if (this.useRealData) {
      try {
        return await this.makeAuthenticatedRequest('/api/admin/stats');
      } catch (error) {
        console.warn('Erro ao buscar estatísticas reais, usando dados vazios:', error);
        return {
          totalUsers: 0,
          activeUsers: 0,
          totalGames: 0,
          totalTransactions: 0,
          totalRevenue: 0,
          totalWithdrawals: 0,
          netBalance: 0
        };
      }
    }
    
    // Dados vazios para produção
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalGames: 0,
      totalTransactions: 0,
      totalRevenue: 0,
      totalWithdrawals: 0,
      netBalance: 0
    };
  }

  // Métricas de jogo
  async getGameStats() {
    if (this.useRealData) {
      try {
        return await this.makeAuthenticatedRequest('/api/admin/game-stats');
      } catch (error) {
        console.warn('Erro ao buscar métricas de jogo reais, usando dados vazios:', error);
        return {
          totalShots: 0,
          totalGoals: 0,
          accuracyRate: 0,
          averageShotsPerUser: 0
        };
      }
    }
    
    return {
      totalShots: 0,
      totalGoals: 0,
      accuracyRate: 0,
      averageShotsPerUser: 0
    };
  }
}

export default new DataService();

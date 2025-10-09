/**
 * Dados fictícios para desenvolvimento
 * ⚠️ ATENÇÃO: Este arquivo deve ser usado APENAS em ambiente de desenvolvimento
 * ⚠️ EM PRODUÇÃO: Todos os dados devem vir do backend real
 */

// Dados vazios para produção - substituir dados fictícios
export const mockUsers = [];
export const mockGames = [];
export const mockTopPlayers = [];

export const mockDashboardData = {
  users: 0,
  games: { 
    total: 0, 
    waiting: 0, 
    active: 0, 
    finished: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  },
  bets: 0,
  queue: 0,
  revenue: 0,
  profit: 0,
  averageBet: 0,
  successRate: 0,
  topPlayers: []
};

export const mockTransactions = [];
export const mockLogs = [];
export const mockWithdrawals = [];

// Função para verificar se está em modo de desenvolvimento
export const isDevelopmentMode = () => {
  return import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'development';
};

// Função para obter dados baseado no ambiente
export const getDataForEnvironment = (mockData, realData = []) => {
  if (isDevelopmentMode()) {
    console.warn('⚠️ Usando dados fictícios - Modo desenvolvimento');
    return mockData;
  }
  
  console.log('✅ Usando dados reais - Modo produção');
  return realData;
};
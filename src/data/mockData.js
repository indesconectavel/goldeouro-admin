/**
 * Dados fictícios para desenvolvimento
 * Usados apenas em ambiente de desenvolvimento
 */

export const mockUsers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@goldeouro.com',
    balance: 150.50,
    status: 'active',
    created_at: '2025-01-15T10:30:00Z',
    last_login: '2025-01-17T14:25:00Z',
    totalChutes: 25,
    totalGols: 18,
    totalCreditos: 500.00,
    totalDebitos: 50.00,
    saldo: 150.50
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@goldeouro.com',
    balance: 75.25,
    status: 'active',
    created_at: '2025-01-14T09:15:00Z',
    last_login: '2025-01-17T13:45:00Z',
    totalChutes: 22,
    totalGols: 16,
    totalCreditos: 300.00,
    totalDebitos: 25.00,
    saldo: 75.25
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@goldeouro.com',
    balance: 200.00,
    status: 'active',
    created_at: '2025-01-13T16:20:00Z',
    last_login: '2025-01-17T12:30:00Z',
    totalChutes: 20,
    totalGols: 14,
    totalCreditos: 400.00,
    totalDebitos: 30.00,
    saldo: 200.00
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    email: 'ana@goldeouro.com',
    balance: 50.75,
    status: 'blocked',
    created_at: '2025-01-12T11:45:00Z',
    last_login: '2025-01-16T08:20:00Z',
    totalChutes: 15,
    totalGols: 9,
    totalCreditos: 200.00,
    totalDebitos: 15.00,
    saldo: 50.75
  },
  {
    id: 5,
    name: 'Carlos Lima',
    email: 'carlos@goldeouro.com',
    balance: 300.00,
    status: 'active',
    created_at: '2025-01-11T14:10:00Z',
    last_login: '2025-01-17T15:10:00Z',
    totalChutes: 18,
    totalGols: 12,
    totalCreditos: 600.00,
    totalDebitos: 40.00,
    saldo: 300.00
  }
];

export const mockGames = [
  {
    id: 1001,
    player: 'João Silva',
    gameType: 'Chute ao Gol',
    result: 'Gol',
    timestamp: '2025-01-17T14:30:00Z',
    bet: 10.50,
    status: 'finished'
  },
  {
    id: 1002,
    player: 'Maria Santos',
    gameType: 'Penalty',
    result: 'Defesa',
    timestamp: '2025-01-17T14:25:00Z',
    bet: 25.00,
    status: 'finished'
  },
  {
    id: 1003,
    player: 'Pedro Costa',
    gameType: 'Falta',
    result: 'Gol',
    timestamp: '2025-01-17T14:20:00Z',
    bet: 15.75,
    status: 'finished'
  },
  {
    id: 1004,
    player: 'Ana Oliveira',
    gameType: 'Chute ao Gol',
    result: 'Defesa',
    timestamp: '2025-01-17T14:15:00Z',
    bet: 8.25,
    status: 'finished'
  },
  {
    id: 1005,
    player: 'Carlos Lima',
    gameType: 'Penalty',
    result: 'Gol',
    timestamp: '2025-01-17T14:10:00Z',
    bet: 30.00,
    status: 'finished'
  }
];

export const mockTopPlayers = [
  { 
    name: 'João Silva', 
    totalGols: 18, 
    totalPartidas: 25, 
    eficiencia: 72.0 
  },
  { 
    name: 'Maria Santos', 
    totalGols: 16, 
    totalPartidas: 22, 
    eficiencia: 72.7 
  },
  { 
    name: 'Pedro Costa', 
    totalGols: 14, 
    totalPartidas: 20, 
    eficiencia: 70.0 
  },
  { 
    name: 'Carlos Lima', 
    totalGols: 12, 
    totalPartidas: 18, 
    eficiencia: 66.7 
  },
  { 
    name: 'Ana Oliveira', 
    totalGols: 9, 
    totalPartidas: 15, 
    eficiencia: 60.0 
  }
];

export const mockDashboardData = {
  users: 50,
  games: { 
    total: 100, 
    waiting: 8, 
    active: 12, 
    finished: 80,
    today: 15,
    thisWeek: 45,
    thisMonth: 100
  },
  bets: 1000,
  queue: 5,
  revenue: 500,
  profit: 250,
  averageBet: 10.00,
  successRate: 75.5,
  topPlayers: mockTopPlayers
};

export const mockTransactions = [
  {
    id: 1,
    user: 'João Silva',
    type: 'deposit',
    amount: 50.00,
    status: 'completed',
    timestamp: '2025-01-17T10:30:00Z'
  },
  {
    id: 2,
    user: 'Maria Santos',
    type: 'withdrawal',
    amount: 25.00,
    status: 'pending',
    timestamp: '2025-01-17T09:15:00Z'
  },
  {
    id: 3,
    user: 'Pedro Costa',
    type: 'deposit',
    amount: 100.00,
    status: 'completed',
    timestamp: '2025-01-17T08:45:00Z'
  }
];

export const mockLogs = [
  {
    id: 1,
    level: 'info',
    message: 'Usuário João Silva fez login',
    timestamp: '2025-01-17T14:30:00Z',
    source: 'auth'
  },
  {
    id: 2,
    level: 'warn',
    message: 'Tentativa de login falhada para email inválido',
    timestamp: '2025-01-17T14:25:00Z',
    source: 'auth'
  },
  {
    id: 3,
    level: 'error',
    message: 'Erro ao processar pagamento PIX',
    timestamp: '2025-01-17T14:20:00Z',
    source: 'payment'
  }
];

// Configurações de ambiente para o Painel Admin
const DEFAULT_API_URL = 'https://goldeouro-backend-v2.fly.dev';

export const normalizeApiBaseUrl = (rawUrl) => {
  const normalized = String(rawUrl || '').trim().replace(/\/+$/, '');
  return normalized || DEFAULT_API_URL;
};

export const logout = () => {
  try {
    // Limpar dados do localStorage (ambas as convenções)
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin-remember');
    
    // Limpar dados da sessão
    sessionStorage.clear();
    
    console.log('Logout realizado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
};

export const getAdminToken = () => {
  return localStorage.getItem('admin-token') || localStorage.getItem('admin_token') || null;
};

export const setAdminToken = (token) => {
  localStorage.setItem('admin-token', token);
  localStorage.setItem('admin_token', token); // Manter compatibilidade
};

export const getAdminUser = () => {
  try {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};

export const setAdminUser = (user) => {
  localStorage.setItem('admin_user', JSON.stringify(user));
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  const user = getAdminUser();
  return !!(token && user);
};

export const getApiUrl = () => {
  return normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
};

export const getAdminTokenHeader = () => {
  const token = getAdminToken();
  return token ? `Bearer ${token}` : null;
};

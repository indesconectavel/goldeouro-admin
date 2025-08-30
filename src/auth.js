// src/auth.js - Sistema de autenticação simples (TODO: trocar por real)

const TOKEN_KEY = 'admin-token';

export function isAuthenticated() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token && token.length > 0;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
}

export function login(token) {
  try {
    if (!token || typeof token !== 'string') {
      throw new Error('Token inválido');
    }
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return false;
  }
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar autenticação:', error);
    return false;
  }
}

// TODO: Implementar verificação real de token
export async function validateToken(token) {
  // Simulação de validação (substituir por chamada real à API)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Por enquanto, apenas verifica se o token existe
      resolve(!!token && token.length > 0);
    }, 100);
  });
}

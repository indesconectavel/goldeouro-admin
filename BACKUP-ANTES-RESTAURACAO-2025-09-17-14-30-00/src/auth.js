// src/auth.js - Sistema de autenticação JWT real

import authService from './services/authService';

// Funções de compatibilidade com o sistema antigo
export function isAuthenticated() {
  return authService.isAuthenticated();
}

export function getToken() {
  return authService.getToken();
}

export function login(credentials) {
  // Compatibilidade: se for string, tratar como senha
  if (typeof credentials === 'string') {
    return authService.login({ username: 'admin', password: credentials });
  }
  return authService.login(credentials);
}

export function logout() {
  return authService.logout();
}

export function clearAuth() {
  return authService.logout();
}

export async function validateToken(token) {
  return authService.validateToken();
}

// Novas funções JWT
export function getUserInfo() {
  return authService.getUserInfo();
}

export function refreshToken() {
  return authService.refreshToken();
}

export default authService;

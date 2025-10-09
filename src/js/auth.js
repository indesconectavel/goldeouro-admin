export function isAuthenticated() {
  const token = localStorage.getItem('admin-token');
  const timestamp = localStorage.getItem('admin-token-timestamp');
  
  if (!token || !timestamp) {
    return false;
  }
  
  // Verificar se o token não expirou (24 horas)
  const now = Date.now();
  const tokenTime = parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000; // 24 horas em ms
  
  if (now - tokenTime > maxAge) {
    // Token expirado, limpar
    logout();
    return false;
  }
  
  return true;
}

export function login(token) {
  const timestamp = Date.now().toString();
  localStorage.setItem('admin-token', token);
  localStorage.setItem('admin-token-timestamp', timestamp);
}

export function logout() {
  localStorage.removeItem('admin-token');
  localStorage.removeItem('admin-token-timestamp');
}

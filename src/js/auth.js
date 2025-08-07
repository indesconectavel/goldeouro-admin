export function isAuthenticated() {
  const token = localStorage.getItem('admin-token');
  return !!token;
}

export function login(token) {
  localStorage.setItem('admin-token', token);
}

export function logout() {
  localStorage.removeItem('admin-token');
}

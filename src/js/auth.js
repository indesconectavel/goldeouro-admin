export const isAuthenticated = () => {
  const storedToken = localStorage.getItem('adminToken');
  return storedToken === import.meta.env.VITE_ADMIN_TOKEN;
};

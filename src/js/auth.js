
export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return token === import.meta.env.VITE_ADMIN_TOKEN;
};

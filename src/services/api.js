// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex.: http://localhost:3000
  timeout: 15000,
});

// adiciona o token em TODO request
api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_ADMIN_TOKEN; // "goldeouro123" no .env do front
  if (token) {
    config.headers['x-admin-token'] = token;
  }
  return config;
});

// (opcional) log de erro
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err?.response?.status, err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;

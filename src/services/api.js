import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'x-admin-token': 'goldeouro123',
  },
});

export default api;

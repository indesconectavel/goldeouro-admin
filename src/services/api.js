import axios from 'axios';
import { getApiUrl } from '../config/env';

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'x-admin-token': 'goldeouro123',
  },
});

export { api };
export default api;

import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Attach JWT from localStorage on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('nro_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nro_admin_token');
      localStorage.removeItem('nro_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;

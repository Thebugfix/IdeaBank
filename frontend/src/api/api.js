import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ideabank-t2t6.onrender.com/api', // <-- Critical
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
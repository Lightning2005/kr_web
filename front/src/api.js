import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Перехватчик для добавления JWT токена в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    // Убираем возможные кавычки, если они попали в строку
    config.headers.Authorization = `Bearer ${token.replace(/"/g, '').trim()}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
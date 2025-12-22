import axios from 'axios';

// Create an axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/user'),
};

// Bean endpoints
export const beanAPI = {
  getAllBeans: () => api.get('/beans'),
  getBeanById: (id) => api.get(`/beans/${id}`),
  createBean: (beanData) => api.post('/beans', beanData),
  updateBean: (id, beanData) => api.put(`/beans/${id}`, beanData),
  deleteBean: (id) => api.delete(`/beans/${id}`),
};

// Grinder endpoints
export const grinderAPI = {
  getAllGrinders: () => api.get('/grinders'),
  getGrinderById: (id) => api.get(`/grinders/${id}`),
  createGrinder: (grinderData) => api.post('/grinders', grinderData),
  updateGrinder: (id, grinderData) => api.put(`/grinders/${id}`, grinderData),
  deleteGrinder: (id) => api.delete(`/grinders/${id}`),
};

export default api;
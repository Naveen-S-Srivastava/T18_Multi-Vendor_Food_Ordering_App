import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const restaurantService = {
  getAll: () => api.get('/restaurant'),
  getById: (id) => api.get(`/restaurant/${id}`),
  create: (data) => api.post('/restaurant', data),
  update: (id, data) => api.put(`/restaurant/${id}`, data),
  delete: (id) => api.delete(`/restaurant/${id}`),
};

export const menuService = {
  getByRestaurant: (restaurantId) => api.get(`/menu/restaurant/${restaurantId}`),
  getById: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
};

export const orderService = {
  getAll: () => api.get('/order'),
  getById: (id) => api.get(`/order/${id}`),
  create: (data) => api.post('/order', data),
  update: (id, data) => api.put(`/order/${id}`, data),
  getByCustomer: (customerId) => api.get(`/order/customer/${customerId}`),
};

export const vendorService = {
  getAll: () => api.get('/vendor'),
  getById: (id) => api.get(`/vendor/${id}`),
  update: (id, data) => api.put(`/vendor/${id}`, data),
};

export default api;

import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (id, data) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getNearby: (lat, lng, maxDistance = 5000) => 
    api.get(`/restaurants/nearby?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  getMyRestaurants: () => api.get('/restaurants/my-restaurants'),
  toggleStatus: (id) => api.put(`/restaurants/${id}/toggle-status`),
};

// Menu APIs
export const menuAPI = {
  getCategories: (restaurantId) => api.get(`/menu/${restaurantId}/categories`),
  getItems: (restaurantId, params) => api.get(`/menu/${restaurantId}/items`, { params }),
  getItem: (itemId) => api.get(`/menu/items/${itemId}`),
  createCategory: (restaurantId, data) => api.post(`/menu/${restaurantId}/categories`, data),
  createItem: (restaurantId, data) => api.post(`/menu/${restaurantId}/items`, data),
  updateItem: (itemId, data) => api.put(`/menu/items/${itemId}`, data),
  toggleAvailability: (itemId) => api.put(`/menu/items/${itemId}/toggle-availability`),
  deleteItem: (itemId) => api.delete(`/menu/items/${itemId}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/apply-coupon', { code }),
  removeCoupon: () => api.post('/cart/remove-coupon'),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getStats: () => api.get('/orders/stats'),
};

// Delivery APIs
export const deliveryAPI = {
  getAvailable: (latitude, longitude) => 
    api.get(`/deliveries/available?latitude=${latitude}&longitude=${longitude}`),
  getMyDeliveries: (params) => api.get('/deliveries', { params }),
  accept: (id) => api.post(`/deliveries/${id}/accept`),
  updateLocation: (id, location) => api.put(`/deliveries/${id}/location`, location),
  updateStatus: (id, status) => api.put(`/deliveries/${id}/status`, { status }),
};

// Payment APIs
export const paymentAPI = {
  getAll: (params) => api.get('/payments', { params }),
  create: (data) => api.post('/payments', data),
  verify: (id, data) => api.post(`/payments/${id}/verify`, data),
};

// Review APIs
export const reviewAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  addResponse: (id, text) => api.post(`/reviews/${id}/response`, { text }),
  markHelpful: (id) => api.put(`/reviews/${id}/helpful`),
};

// Coupon APIs
export const couponAPI = {
  getAll: () => api.get('/coupons'),
  validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Admin APIs
export const adminAPI = {
  // User Management
  getUsers: (params) => api.get('/users', { params }),
  getUserStats: () => api.get('/users/stats'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  toggleUserStatus: (id) => api.put(`/users/${id}/toggle-status`),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Restaurant Management
  getAllRestaurants: (params) => api.get('/restaurants', { params }),
  updateRestaurant: (id, data) => api.put(`/restaurants/${id}`, data),
  deleteRestaurant: (id) => api.delete(`/restaurants/${id}`),
};

export default api;

import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('amazon_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Service API calls
export const userApi = {
  register: (data: any) => api.post('/user/register', data),
  login: (data: any) => api.post('/user/login', data),
  logout: () => api.post('/user/logout'),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile/update', data),
  deleteProfile: () => api.delete('/user/profile/delete'),
  getAllUsers: () => api.get('/user/users'),
};

// Product Service API calls
export const productApi = {
  getProducts: (params?: any) => api.get('/product/products', { params }),
  getProductById: (id: string) => api.get(`/product/products/${id}`),
  getCategories: () => api.get('/product/categories'),
  addProduct: (data: any) => api.post('/product/products', data),
  updateProduct: (id: string, data: any) => api.put(`/product/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/product/products/${id}`),
};

// Cart Service API calls
export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId: string, quantity: number = 1) => api.post('/cart/add', { productId, quantity }),
  increaseQuantity: (productId: string) => api.put('/cart/increase', { productId }),
  decreaseQuantity: (productId: string) => api.put('/cart/decrease', { productId }),
  removeItem: (productId: string) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.post('/cart/clear'),
};

// Order Service API calls
export const orderApi = {
  checkout: (data: { paymentMethod: string; shippingAddress: any }) => api.post('/order/checkout', data),
  getMyOrders: () => api.get('/order/my-orders'),
  getAllOrders: () => api.get('/order/all-orders'),
  getOrderById: (id: string) => api.get(`/order/${id}`),
  cancelOrder: (id: string) => api.post(`/order/${id}/cancel`),
  updateOrderStatus: (id: string, status: string) => api.put(`/order/${id}/status`, { status }),
};

// Payment Service API calls
export const paymentApi = {
  getHistory: () => api.get('/payment/history'),
  getTransactionById: (txnId: string) => api.get(`/payment/transactions/${txnId}`),
};

// Notification Service API calls
export const notificationApi = {
  getLogs: () => api.get('/notification/logs'),
};

// API Gateway & Health Dashboard calls
export const gatewayApi = {
  getDashboard: () => axios.get('/dashboard'),
  pingService: (serviceName: string) => axios.get(`/ping/${serviceName}`),
  getHealth: () => axios.get('/health'),
};

import axios from 'axios';

const API_BASE_URL = 'https://drone-flux-system-server.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (when JWT is implemented)
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
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userInfo) => api.post('/auth/signup', userInfo),
  getProfile: () => api.get('/auth/profile'),
  setAuthHeader: setAuthHeader
};

// Drones API
export const dronesAPI = {
  getAll: () => api.get('/drones'),
  getById: (id) => api.get(`/drones/${id}`),
  create: (drone) => api.post('/drones', drone),
  updateStatus: (id, status) => api.patch(`/drones/${id}/status`, { status }),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  assignDrone: (id, droneId) => api.patch(`/orders/${id}/assign-drone`, { droneId }),
  delete: (id) => api.delete(`/orders/${id}`),
};

export default api;
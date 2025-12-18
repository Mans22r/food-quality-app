import axios from 'axios';
import { storage } from '../utils/storage';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://192.168.1.16:5001/api', // Backend API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await storage.removeItem('accessToken');
      await storage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
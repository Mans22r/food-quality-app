import api from './api';

import { storage } from '../utils/storage';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user } = response.data;
    
    // Store tokens and user data
    await storage.setItem('accessToken', accessToken);
    await storage.setItem('user', JSON.stringify(user));
    
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed' 
    };
  }
};

export const logout = async () => {
  await storage.removeItem('accessToken');
  await storage.removeItem('user');
};

export const getCurrentUser = async () => {
  const user = await storage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = async () => {
  const token = await storage.getItem('accessToken');
  return !!token;
};

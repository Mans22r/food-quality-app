'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { useRouter } from 'next/navigation';

// Define User type
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        setAccessToken(token);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = data;
      
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
      
      setAccessToken(accessToken);
      setUser(user);
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (user.role === 'HOTEL_MANAGEMENT') {
        router.push('/dashboard/hotel-management');
      } else if (user.role === 'INSPECTOR') {
        router.push('/dashboard/inspector');
      } else if (user.role === 'KITCHEN_MANAGER') {
        router.push('/dashboard/kitchen-manager');
      } else {
        router.push('/login');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setAccessToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

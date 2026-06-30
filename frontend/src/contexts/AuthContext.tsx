import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/axios';

interface User {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (access: string, refresh: string, is_staff: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Just decode token or assume logged in if we don't have a /me endpoint
        // For simplicity, we just rely on presence of token
        // If we want real user data, we should fetch it or decode JWT
        // In this app, maybe we just store is_staff in localStorage too
        const is_staff = localStorage.getItem('isStaff') === 'true';
        setUser({ id: 0, email: '', username: 'User', is_staff });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (access: string, refresh: string, is_staff: boolean) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('isStaff', String(is_staff));
    setUser({ id: 0, email: '', username: 'User', is_staff });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isStaff');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

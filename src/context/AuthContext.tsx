import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  deleteProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('amazon_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      userApi
        .getProfile()
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await userApi.login({ email, password });
    if (res.data.success) {
      const { user, token } = res.data.data;
      localStorage.setItem('amazon_token', token);
      setToken(token);
      setUser(user);
    }
  };

  const register = async (data: any) => {
    const res = await userApi.register(data);
    if (res.data.success) {
      const { user, token } = res.data.data;
      localStorage.setItem('amazon_token', token);
      setToken(token);
      setUser(user);
    }
  };

  const logout = () => {
    localStorage.removeItem('amazon_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const res = await userApi.updateProfile(data);
    if (res.data.success) {
      setUser(res.data.data);
    }
  };

  const deleteProfile = async () => {
    await userApi.deleteProfile();
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

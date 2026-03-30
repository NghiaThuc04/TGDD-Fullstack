
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { loginApi, registerApi, socialLoginApi, updateProfileApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (username: string, pass: string) => Promise<void>;
  register: (username: string, pass: string, name: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('ob_auth_user');
    if (savedUser) {
      setState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (username: string, pass: string) => {
    try {
      const user = await loginApi(username, pass);
      localStorage.setItem('ob_auth_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) return;
    try {
      const updatedUser = await updateProfileApi(state.user.id, data);
      localStorage.setItem('ob_auth_user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, pass: string, name: string) => {
    try {
      const user = await registerApi(username, pass, name);
      localStorage.setItem('ob_auth_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      throw error;
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const user = await socialLoginApi(provider);
      localStorage.setItem('ob_auth_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('ob_auth_user');
    localStorage.removeItem('ob_jwt_token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, socialLogin, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/types/user';
import { authService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token?: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const savedUser = authService.getUser();
    const isAuthenticated = authService.isAuthenticated();
    
    console.log('AuthContext initialization - savedUser:', savedUser, 'isAuthenticated:', isAuthenticated);
    
    if (isAuthenticated && savedUser) {
      setUser(savedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = (user: User, token?: string, refreshToken?: string) => {
    console.log('AuthContext login called with:', { user, token, refreshToken });
    
    if (!user) {
      console.error('Login called without user data:', { user });
      return;
    }
    
    const authResponse: AuthResponse = {
      user,
      accessToken: token,
      refreshToken
    };
    authService.saveAuthResponse(authResponse);
    setUser(user);
    console.log('Login completed, user state set to:', user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    authService.setUser(updatedUser);
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

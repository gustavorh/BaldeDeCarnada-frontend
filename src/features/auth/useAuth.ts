'use client';

import { useState } from 'react';
import { authApi } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDto, RegisterUserDto } from '@/types/user';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, logout: contextLogout } = useAuth();

  const loginUser = async (loginData: LoginDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authResponse = await authApi.login(loginData);
      login(authResponse.user, authResponse.accessToken, authResponse.refreshToken);
      return authResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (registerData: RegisterUserDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authApi.register(registerData);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authApi.logout();
    } catch (err) {
      // Even if logout fails on server, we should clear local state
      console.error('Logout error:', err);
    } finally {
      contextLogout();
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loginUser,
    registerUser,
    logoutUser,
    isLoading,
    error,
    clearError,
  };
}

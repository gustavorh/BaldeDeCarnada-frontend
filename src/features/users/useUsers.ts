'use client';

import { useState } from 'react';
import { usersApi } from '@/api/users';
import { User, RegisterUserDto } from '@/types/user.d';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await usersApi.getAllUsers();
      setUsers(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await usersApi.getUserById(id);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: RegisterUserDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newUser = await usersApi.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    users,
    isLoading,
    error,
    fetchAllUsers,
    fetchUserById,
    createUser,
    clearError,
  };
}

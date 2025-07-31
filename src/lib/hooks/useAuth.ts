import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthAPI } from '../api/auth';
import { LoginCredentials, RegisterUserData, User } from '../types/auth';

// Query keys
export const AUTH_QUERY_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
};

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthAPI.login(credentials),
    onSuccess: (user: User) => {
      // Update the current user query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, user);
      
      // Invalidate and refetch current user query
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser });
    },
    onError: (error: Error) => {
      console.error('Login failed:', error.message);
    },
  });
};

// Hook for register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterUserData) => AuthAPI.register(userData),
    onError: (error: Error) => {
      console.error('Registration failed:', error.message);
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      AuthAPI.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
};

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: () => {
      const user = AuthAPI.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }
      return user;
    },
    enabled: AuthAPI.isAuthenticated(), // Only run if user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry if user is not authenticated
  });
};

// Hook to check authentication status
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const isAuthenticated = AuthAPI.isAuthenticated();

  return {
    user,
    isAuthenticated,
    isLoading: isAuthenticated && isLoading,
    error,
  };
};

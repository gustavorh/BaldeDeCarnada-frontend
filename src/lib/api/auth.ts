import { apiClient } from './client';
import { LoginCredentials, RegisterUserData, AuthResponse, User } from '../types/auth';
import Cookies from 'js-cookie';

export class AuthAPI {
  private static readonly AUTH_ENDPOINTS = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  };

  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post<User>(
        this.AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        // Store user data in cookies (could also use localStorage)
        Cookies.set('user_data', JSON.stringify(response.data), { expires: 7 });
        
        // Note: The backend doesn't seem to return a JWT token in the current implementation
        // You might need to modify the backend to include a token in the response
        // For now, we'll store a placeholder or rely on session-based auth
        
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  static async register(userData: RegisterUserData): Promise<User> {
    try {
      // Send only email, name, and password - backend handles default role assignment
      const response = await apiClient.post<User>(
        this.AUTH_ENDPOINTS.REGISTER,
        userData
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  static logout(): void {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  static getCurrentUser(): User | null {
    try {
      const userData = Cookies.get('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const token = Cookies.get('auth_token');
    const userData = Cookies.get('user_data');
    return !!(token || userData); // Return true if either exists
  }
}

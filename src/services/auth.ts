import { AuthResponse, User } from '@/types/user.d';

class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  // Token management (kept for future use if tokens are added)
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  // User management
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      console.log('Setting user:', user);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log('User set in localStorage:', localStorage.getItem(this.USER_KEY));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        // If JSON parsing fails, clear the corrupted data and return null
        console.warn('Failed to parse user data from localStorage, clearing corrupted data:', error);
        localStorage.removeItem(this.USER_KEY);
        return null;
      }
    }
    return null;
  }

  // Auth state
  isAuthenticated(): boolean {
    // Since there are no tokens, check if user exists and is valid
    const user = this.getUser();
    return user !== null && user.isActive;
  }

  // Clear auth data
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  // Save auth response
  saveAuthResponse(authResponse: AuthResponse): void {
    console.log('Saving auth response:', authResponse);
    
    // Only save token if it exists (for backends that provide tokens)
    if (authResponse.accessToken) {
      this.setToken(authResponse.accessToken);
    }
    
    if (authResponse.refreshToken) {
      this.setRefreshToken(authResponse.refreshToken);
    }
    
    this.setUser(authResponse.user);
    console.log('Auth data saved. User:', this.getUser());
  }

  // Refresh token - will be implemented with API calls
  async refreshToken(): Promise<void> {
    // Import authApi dynamically to avoid circular dependency
    const { authApi } = await import('@/api/auth');
    await authApi.refreshToken();
  }
}

export const authService = new AuthService();

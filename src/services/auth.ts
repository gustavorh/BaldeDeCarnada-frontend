import { AuthResponse, User } from '@/types/user.d';

class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  // Token management
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
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Auth state
  isAuthenticated(): boolean {
    return this.getToken() !== null;
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
    this.setToken(authResponse.accessToken);
    if (authResponse.refreshToken) {
      this.setRefreshToken(authResponse.refreshToken);
    }
    this.setUser(authResponse.user);
  }

  // Refresh token - will be implemented with API calls
  async refreshToken(): Promise<void> {
    // Import authApi dynamically to avoid circular dependency
    const { authApi } = await import('@/api/auth');
    await authApi.refreshToken();
  }
}

export const authService = new AuthService();

import axios from 'axios';
import { API_BASE_URL } from '@/constants/endpoints';
import { authService } from './auth';
import { handleApiError } from './errorHandler';

class HttpService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config: any) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = authService.getRefreshToken();
            if (refreshToken) {
              // Attempt to refresh token
              await authService.refreshToken();
              const newToken = authService.getToken();
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            authService.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async post<T, D = any>(url: string, data?: D, config?: any): Promise<T> {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async put<T, D = any>(url: string, data?: D, config?: any): Promise<T> {
    try {
      const response = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async patch<T, D = any>(url: string, data?: D, config?: any): Promise<T> {
    try {
      const response = await this.api.patch(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export const httpService = new HttpService();

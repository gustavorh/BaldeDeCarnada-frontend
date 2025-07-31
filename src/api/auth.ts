import { httpService } from '@/services/http';
import { authService } from '@/services/auth';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { ApiResponseDto } from '@/types/api.d';
import { 
  AuthResponse, 
  LoginDto, 
  RegisterUserDto,
  User 
} from '@/types/user.d';

export class AuthApi {
  async login(loginData: LoginDto): Promise<AuthResponse> {
    const response = await httpService.post<ApiResponseDto<User>>(
      API_ENDPOINTS.AUTH.LOGIN,
      loginData
    );
    
    if (response.success && response.data) {
      // Since your backend only returns user data, we create an AuthResponse
      return {
        user: response.data,
        // No tokens provided by backend
      };
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async register(registerData: RegisterUserDto): Promise<User> {
    const response = await httpService.post<ApiResponseDto<User>>(
      API_ENDPOINTS.AUTH.REGISTER,
      registerData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await httpService.post<ApiResponseDto<AuthResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    if (response.success && response.data) {
      authService.saveAuthResponse(response.data);
      return response.data;
    }
    
    throw new Error(response.error || 'Token refresh failed');
  }

  async logout(): Promise<void> {
    try {
      await httpService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      authService.logout();
    }
  }
}

export const authApi = new AuthApi();

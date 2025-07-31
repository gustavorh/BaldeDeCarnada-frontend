import { httpService } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { ApiResponseDto } from '@/types/api.d';
import { User, RegisterUserDto } from '@/types/user.d';

export class UsersApi {
  async getAllUsers(): Promise<User[]> {
    const response = await httpService.get<ApiResponseDto<User[]>>(
      API_ENDPOINTS.USERS.BASE
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch users');
  }

  async getUserById(id: string): Promise<User> {
    const response = await httpService.get<ApiResponseDto<User>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'User not found');
  }

  async createUser(userData: RegisterUserDto): Promise<User> {
    const response = await httpService.post<ApiResponseDto<User>>(
      API_ENDPOINTS.USERS.BASE,
      userData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create user');
  }
}

export const usersApi = new UsersApi();

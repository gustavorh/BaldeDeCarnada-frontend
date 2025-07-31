// API Client
export { apiClient } from './api/client';

// Auth API
export { AuthAPI } from './api/auth';

// Types
export type { 
  LoginCredentials, 
  RegisterUserData, 
  User, 
  AuthResponse, 
  ApiErrorResponse 
} from './types/auth';

export type { 
  ApiResponse, 
  PaginatedResponse 
} from './types/api';

// Hooks
export { 
  useLogin, 
  useRegister, 
  useLogout, 
  useCurrentUser, 
  useAuth,
  AUTH_QUERY_KEYS 
} from './hooks/useAuth';

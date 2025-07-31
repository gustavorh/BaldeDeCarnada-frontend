// Auth types based on backend DTOs
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  email: string;
  name: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

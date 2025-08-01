export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
}

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;  // Optional since your backend doesn't provide tokens
  refreshToken?: string;
}

// For backends that only return user data without tokens
export interface SimpleAuthResponse {
  user: User;
}

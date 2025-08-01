export interface ApiResponseDto<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponseDto {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  pagination: PaginationDto;
}

export interface CreateResponseDto {
  id: string;
  message: string;
}

export interface UpdateResponseDto {
  message: string;
}

export interface DeleteResponseDto {
  message: string;
}

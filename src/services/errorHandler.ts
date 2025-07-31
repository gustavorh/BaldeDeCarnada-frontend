import { ErrorResponseDto } from '@/types/api.d';

export class ApiError extends Error {
  public statusCode: number;
  public response: ErrorResponseDto;

  constructor(message: string, statusCode: number, response: ErrorResponseDto) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export const handleApiError = (error: unknown): never => {
  const axiosError = error as any; // Type assertion for axios error
  
  if (axiosError.response) {
    // Server responded with error status
    const errorResponse: ErrorResponseDto = axiosError.response.data || {
      success: false,
      error: axiosError.message || 'Unknown error occurred',
      statusCode: axiosError.response.status,
    };

    throw new ApiError(
      errorResponse.error || 'API Error',
      axiosError.response.status,
      errorResponse
    );
  } else if (axiosError.request) {
    // Network error
    throw new ApiError(
      'Network error - please check your connection',
      0,
      {
        success: false,
        error: 'Network error',
        message: 'Please check your internet connection',
      }
    );
  } else {
    // Other error
    throw new ApiError(
      axiosError.message || 'Unknown error occurred',
      500,
      {
        success: false,
        error: axiosError.message || 'Unknown error occurred',
      }
    );
  }
};

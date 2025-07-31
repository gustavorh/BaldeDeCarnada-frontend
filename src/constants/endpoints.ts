// API Base URL - should be set in environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Product endpoints
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    SEARCH: '/products/search',
    ACTIVE: '/products/active',
    AVAILABLE: '/products/available',
  },
  
  // Stock endpoints
  STOCK: {
    BASE: '/stock',
    BY_PRODUCT_ID: (productId: string) => `/stock/product/${productId}`,
    LOW_STOCK: '/stock/low',
    INCREASE: '/stock/increase',
    DECREASE: '/stock/decrease',
    UPDATE_QUANTITY: '/stock/update-quantity',
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
  },
  
  // User endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  
  // Attendance endpoints
  ATTENDANCE: {
    BASE: '/attendance',
    REGISTER: '/attendance/register',
  },
  
  // Reports endpoints
  REPORTS: {
    SALES: '/reports/sales',
    STOCK: '/reports/stock',
    ATTENDANCE: '/reports/attendance',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

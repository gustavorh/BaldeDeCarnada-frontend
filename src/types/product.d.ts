export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  isActive?: boolean;
}

export interface ProductSearchParams {
  name?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

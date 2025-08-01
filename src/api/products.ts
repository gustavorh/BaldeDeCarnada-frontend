import { httpService } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { ApiResponseDto } from '@/types/api';
import { 
  Product, 
  CreateProductDto, 
  UpdateProductDto,
  ProductSearchParams 
} from '@/types/product';

export class ProductsApi {
  async getAllProducts(params?: ProductSearchParams): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.name) queryParams.append('name', params.name);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${API_ENDPOINTS.PRODUCTS.BASE}?${queryParams.toString()}`;
    const response = await httpService.get<ApiResponseDto<Product[]>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch products');
  }

  async getProductById(id: string): Promise<Product> {
    const response = await httpService.get<ApiResponseDto<Product>>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Product not found');
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await httpService.get<ApiResponseDto<Product[]>>(
      API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch products by category');
  }

  async searchProducts(name: string): Promise<Product[]> {
    const response = await httpService.get<ApiResponseDto<Product[]>>(
      `${API_ENDPOINTS.PRODUCTS.SEARCH}?name=${encodeURIComponent(name)}`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to search products');
  }

  async getActiveProducts(): Promise<Product[]> {
    const response = await httpService.get<ApiResponseDto<Product[]>>(
      API_ENDPOINTS.PRODUCTS.ACTIVE
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch active products');
  }

  async getAvailableProducts(): Promise<Product[]> {
    const response = await httpService.get<ApiResponseDto<Product[]>>(
      API_ENDPOINTS.PRODUCTS.AVAILABLE
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch available products');
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const response = await httpService.post<ApiResponseDto<Product>>(
      API_ENDPOINTS.PRODUCTS.BASE,
      productData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create product');
  }

  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    const response = await httpService.put<ApiResponseDto<Product>>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id),
      productData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update product');
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await httpService.delete<ApiResponseDto<void>>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id)
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete product');
    }
  }

  async deactivateProduct(id: string): Promise<Product> {
    const response = await httpService.patch<ApiResponseDto<Product>>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id),
      { isActive: false }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to deactivate product');
  }
}

export const productsApi = new ProductsApi();

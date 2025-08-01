import { httpService } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { ApiResponseDto } from '@/types/api';
import { 
  Stock, 
  UpdateStockDto, 
  IncreaseStockDto, 
  DecreaseStockDto 
} from '@/types/stock';

export class StockApi {
  async getAllStock(): Promise<Stock[]> {
    const response = await httpService.get<ApiResponseDto<Stock[]>>(
      API_ENDPOINTS.STOCK.BASE
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch stock');
  }

  async getStockByProductId(productId: string): Promise<Stock> {
    const response = await httpService.get<ApiResponseDto<Stock>>(
      API_ENDPOINTS.STOCK.BY_PRODUCT_ID(productId)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Stock not found for product');
  }

  async getLowStockItems(): Promise<Stock[]> {
    const response = await httpService.get<ApiResponseDto<Stock[]>>(
      API_ENDPOINTS.STOCK.LOW_STOCK
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch low stock items');
  }

  async increaseStock(stockData: IncreaseStockDto): Promise<Stock> {
    const response = await httpService.post<ApiResponseDto<Stock>>(
      API_ENDPOINTS.STOCK.INCREASE,
      stockData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to increase stock');
  }

  async decreaseStock(stockData: DecreaseStockDto): Promise<Stock> {
    const response = await httpService.post<ApiResponseDto<Stock>>(
      API_ENDPOINTS.STOCK.DECREASE,
      stockData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to decrease stock');
  }

  async updateStockQuantity(productId: string, stockData: UpdateStockDto): Promise<Stock> {
    const response = await httpService.put<ApiResponseDto<Stock>>(
      API_ENDPOINTS.STOCK.UPDATE_QUANTITY,
      { productId, ...stockData }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update stock quantity');
  }
}

export const stockApi = new StockApi();

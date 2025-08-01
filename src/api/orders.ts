import { httpService } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { ApiResponseDto } from '@/types/api';
import { Order, CreateOrderDto } from '@/types/order';

export class OrdersApi {
  async getAllOrders(): Promise<Order[]> {
    const response = await httpService.get<ApiResponseDto<Order[]>>(
      API_ENDPOINTS.ORDERS.BASE
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch orders');
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await httpService.get<ApiResponseDto<Order>>(
      API_ENDPOINTS.ORDERS.BY_ID(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Order not found');
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response = await httpService.post<ApiResponseDto<Order>>(
      API_ENDPOINTS.ORDERS.BASE,
      orderData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create order');
  }
}

export const ordersApi = new OrdersApi();

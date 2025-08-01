'use client';

import { useState } from 'react';
import { ordersApi } from '@/api/orders';
import { Order, CreateOrderDto } from '@/types/order';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ordersApi.getAllOrders();
      setOrders(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const order = await ordersApi.getOrderById(id);
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: CreateOrderDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newOrder = await ordersApi.createOrder(orderData);
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    orders,
    isLoading,
    error,
    fetchAllOrders,
    fetchOrderById,
    createOrder,
    clearError,
  };
}

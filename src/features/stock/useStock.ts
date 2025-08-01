'use client';

import { useState } from 'react';
import { stockApi } from '@/api/stock';
import { Stock, UpdateStockDto, IncreaseStockDto, DecreaseStockDto } from '@/types/stock';

export function useStock() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStock = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await stockApi.getAllStock();
      setStock(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStockByProductId = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stockItem = await stockApi.getStockByProductId(productId);
      return stockItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLowStockItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await stockApi.getLowStockItems();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch low stock items';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const increaseStock = async (stockData: IncreaseStockDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStock = await stockApi.increaseStock(stockData);
      setStock(prev => 
        prev.map(item => 
          item.productId === stockData.productId ? updatedStock : item
        )
      );
      return updatedStock;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to increase stock';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseStock = async (stockData: DecreaseStockDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStock = await stockApi.decreaseStock(stockData);
      setStock(prev => 
        prev.map(item => 
          item.productId === stockData.productId ? updatedStock : item
        )
      );
      return updatedStock;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrease stock';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStockQuantity = async (productId: string, stockData: UpdateStockDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStock = await stockApi.updateStockQuantity(productId, stockData);
      setStock(prev => 
        prev.map(item => 
          item.productId === productId ? updatedStock : item
        )
      );
      return updatedStock;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update stock';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    stock,
    isLoading,
    error,
    fetchAllStock,
    fetchStockByProductId,
    fetchLowStockItems,
    increaseStock,
    decreaseStock,
    updateStockQuantity,
    clearError,
  };
}

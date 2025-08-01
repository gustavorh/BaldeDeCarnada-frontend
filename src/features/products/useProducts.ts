'use client';

import { useState } from 'react';
import { productsApi } from '@/api/products';
import { Product, CreateProductDto, UpdateProductDto, ProductSearchParams } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (params?: ProductSearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productsApi.getAllProducts(params);
      setProducts(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const product = await productsApi.getProductById(id);
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newProduct = await productsApi.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: UpdateProductDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProduct = await productsApi.updateProduct(id, productData);
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await productsApi.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchProducts = async (name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productsApi.searchProducts(name);
      setProducts(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    clearError,
  };
}

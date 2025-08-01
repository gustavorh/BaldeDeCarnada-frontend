'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { productsApi } from '@/api/products';
import { Product } from '@/types/product';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ProductsPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home'];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadProducts();
  }, [isAuthenticated, router]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsApi.getAllProducts({
        name: searchTerm || undefined,
        category: selectedCategory || undefined,
        isActive: true
      });
      setProducts(response);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleDeactivateProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to deactivate this product?')) return;

    try {
      await productsApi.updateProduct(productId, { isActive: false });
      await loadProducts(); // Reload the list
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      await productsApi.deleteProduct(productId);
      await loadProducts(); // Reload the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product inventory
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push('/dashboard')}>
                ← Dashboard
              </Button>
              <Button onClick={() => router.push('/products/new')}>
                Add Product
              </Button>
              <Button variant="outline" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Search & Filter</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by name
                  </label>
                  <Input
                    type="text"
                    placeholder="Product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Products List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No products found</p>
                  <Button 
                    className="mt-4"
                    onClick={() => router.push('/products/new')}
                  >
                    Add your first product
                  </Button>
                </div>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="text-sm font-medium">${product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Category:</span>
                          <span className="text-sm">{product.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                        >
                          Edit
                        </Button>
                        {product.isActive && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeactivateProduct(product.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

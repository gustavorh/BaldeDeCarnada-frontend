'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { stockApi } from '@/api/stock';
import { Stock, StockMovementType } from '@/types/stock.d';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function StockPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [error, setError] = useState('');
  const [editingStock, setEditingStock] = useState<{ id: string; quantity: number } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadStocks();
  }, [isAuthenticated, router]);

  const loadStocks = async () => {
    try {
      setIsLoading(true);
      const response = await stockApi.getAllStock();
      setStocks(response);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load stocks');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = !searchTerm || 
      stock.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.productId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLowStock = !showLowStockOnly || stock.quantity <= stock.minQuantity;
    
    return matchesSearch && matchesLowStock;
  });

  const updateStockQuantity = async (stockId: string, newQuantity: number) => {
    try {
      // Find the stock to get the productId
      const stock = stocks.find(s => s.id === stockId);
      if (!stock) {
        setError('Stock not found');
        return;
      }
      
      await stockApi.updateStockQuantity(stock.productId, { quantity: newQuantity });
      await loadStocks();
      setEditingStock(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update stock');
    }
  };

  const handleStockMovement = async (productId: string, type: StockMovementType, quantity: number, reason?: string) => {
    try {
      if (type === StockMovementType.INCREASE) {
        await stockApi.increaseStock({ productId, quantity, reason });
      } else if (type === StockMovementType.DECREASE) {
        await stockApi.decreaseStock({ productId, quantity, reason });
      }
      await loadStocks();
    } catch (err: any) {
      setError(err.message || 'Failed to update stock');
    }
  };

  const getStockStatusColor = (stock: Stock) => {
    if (stock.quantity <= stock.minQuantity) {
      return 'text-red-600 bg-red-50';
    } else if (stock.quantity >= stock.maxQuantity) {
      return 'text-orange-600 bg-orange-50';
    }
    return 'text-green-600 bg-green-50';
  };

  const getStockStatusText = (stock: Stock) => {
    if (stock.quantity <= stock.minQuantity) {
      return 'Low Stock';
    } else if (stock.quantity >= stock.maxQuantity) {
      return 'Overstock';
    }
    return 'Normal';
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
              <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor and manage product inventory levels
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push('/dashboard')}>
                ← Dashboard
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
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search products
                  </label>
                  <Input
                    type="text"
                    placeholder="Product name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showLowStockOnly}
                      onChange={(e) => setShowLowStockOnly(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Show low stock only</span>
                  </label>
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

          {/* Stock Summary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
            <Card title="Total Products">
              <div className="mt-2">
                <div className="text-3xl font-bold text-blue-600">{stocks.length}</div>
              </div>
            </Card>
            
            <Card title="Low Stock Items">
              <div className="mt-2">
                <div className="text-3xl font-bold text-red-600">
                  {stocks.filter(s => s.quantity <= s.minQuantity).length}
                </div>
              </div>
            </Card>
            
            <Card title="Overstock Items">
              <div className="mt-2">
                <div className="text-3xl font-bold text-orange-600">
                  {stocks.filter(s => s.quantity >= s.maxQuantity).length}
                </div>
              </div>
            </Card>
          </div>

          {/* Stocks List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStocks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No stock items found</p>
                </div>
              ) : (
                filteredStocks.map((stock) => (
                  <Card key={stock.id} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {stock.product?.name || `Product ${stock.productId}`}
                            </h3>
                            <span className={`px-3 py-1 text-sm rounded-full ${getStockStatusColor(stock)}`}>
                              {getStockStatusText(stock)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mt-4">
                            <div>
                              <label className="block text-sm text-gray-500">Current Stock</label>
                              {editingStock?.id === stock.id ? (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                    value={editingStock.quantity}
                                    onChange={(e) => setEditingStock({
                                      ...editingStock,
                                      quantity: parseInt(e.target.value) || 0
                                    })}
                                    className="w-20"
                                  />
                                  <Button 
                                    size="sm"
                                    onClick={() => updateStockQuantity(stock.id, editingStock.quantity)}
                                  >
                                    Save
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingStock(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold">{stock.quantity}</span>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingStock({ id: stock.id, quantity: stock.quantity })}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm text-gray-500">Min Quantity</label>
                              <span className="text-sm font-medium">{stock.minQuantity}</span>
                            </div>

                            <div>
                              <label className="block text-sm text-gray-500">Max Quantity</label>
                              <span className="text-sm font-medium">{stock.maxQuantity}</span>
                            </div>

                            <div>
                              <label className="block text-sm text-gray-500">Last Updated</label>
                              <span className="text-sm">{new Date(stock.lastUpdated).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button 
                              size="sm"
                              onClick={() => {
                                const quantity = prompt('Enter quantity to add:');
                                const reason = prompt('Enter reason (optional):');
                                if (quantity && parseInt(quantity) > 0) {
                                  handleStockMovement(stock.productId, StockMovementType.INCREASE, parseInt(quantity), reason || undefined);
                                }
                              }}
                            >
                              + Add Stock
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => {
                                const quantity = prompt('Enter quantity to remove:');
                                const reason = prompt('Enter reason (optional):');
                                if (quantity && parseInt(quantity) > 0) {
                                  handleStockMovement(stock.productId, StockMovementType.DECREASE, parseInt(quantity), reason || undefined);
                                }
                              }}
                            >
                              - Remove Stock
                            </Button>

                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => router.push(`/stock/${stock.id}/history`)}
                            >
                              View History
                            </Button>
                          </div>
                        </div>
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

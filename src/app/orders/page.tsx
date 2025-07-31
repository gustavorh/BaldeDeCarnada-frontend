'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi } from '@/api/orders';
import { Order, OrderStatus } from '@/types/order.d';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function OrdersPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadOrders();
  }, [isAuthenticated, router]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getAllOrders();
      // Filter by status on the client side since API doesn't support it
      const filteredOrders = selectedStatus 
        ? response.filter(order => order.status === selectedStatus)
        : response;
      setOrders(filteredOrders);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (newStatus: OrderStatus | '') => {
    setSelectedStatus(newStatus);
    loadOrders();
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // For now, just simulate the update since the API method doesn't exist
      // await ordersApi.updateOrderStatus(orderId, newStatus);
      console.log(`Updating order ${orderId} to status ${newStatus}`);
      await loadOrders(); // Reload the list
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PREPARING:
        return 'bg-orange-100 text-orange-800';
      case OrderStatus.READY:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return OrderStatus.CONFIRMED;
      case OrderStatus.CONFIRMED:
        return OrderStatus.PREPARING;
      case OrderStatus.PREPARING:
        return OrderStatus.READY;
      case OrderStatus.READY:
        return OrderStatus.DELIVERED;
      default:
        return null;
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
              <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage customer orders and track their status
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push('/dashboard')}>
                ← Dashboard
              </Button>
              <Button onClick={() => router.push('/orders/new')}>
                New Order
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
          {/* Filter */}
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Orders</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedStatus === '' ? 'primary' : 'outline'}
                  onClick={() => handleStatusChange('')}
                  size="sm"
                >
                  All Orders
                </Button>
                {Object.values(OrderStatus).map(status => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? 'primary' : 'outline'}
                    onClick={() => handleStatusChange(status)}
                    size="sm"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Orders List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders found</p>
                  <Button 
                    className="mt-4"
                    onClick={() => router.push('/orders/new')}
                  >
                    Create your first order
                  </Button>
                </div>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.product?.name || `Product ${item.productId}`} x {item.quantity}
                              </span>
                              <span>${item.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                        
                        <div className="flex space-x-2">
                          {getNextStatus(order.status) && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                            >
                              Mark as {(() => {
                                const nextStatus = getNextStatus(order.status);
                                return nextStatus ? nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1) : '';
                              })()}
                            </Button>
                          )}
                          
                          {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          )}
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

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  pendingOrders: number;
  totalUsers: number;
  todaysSales: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    totalUsers: 0,
    todaysSales: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate loading dashboard data
    // In a real app, you would fetch this from your APIs
    setTimeout(() => {
      setStats({
        totalProducts: 150,
        lowStockItems: 12,
        pendingOrders: 8,
        totalUsers: 25,
        todaysSales: 2500
      });
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Role: <span className="font-medium capitalize">{user?.role}</span>
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                <Card title="Total Products">
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalProducts}</div>
                    <p className="text-sm text-gray-600">Active products</p>
                  </div>
                </Card>

                <Card title="Low Stock">
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-red-600">{stats.lowStockItems}</div>
                    <p className="text-sm text-gray-600">Items need restocking</p>
                  </div>
                </Card>

                <Card title="Pending Orders">
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                    <p className="text-sm text-gray-600">Awaiting processing</p>
                  </div>
                </Card>

                <Card title="Total Users">
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-green-600">{stats.totalUsers}</div>
                    <p className="text-sm text-gray-600">System users</p>
                  </div>
                </Card>

                <Card title="Today's Sales">
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-purple-600">${stats.todaysSales}</div>
                    <p className="text-sm text-gray-600">Revenue today</p>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="Quick Actions" className="lg:col-span-1">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button 
                      className="h-20 flex-col"
                      onClick={() => router.push('/products')}
                    >
                      <span className="text-2xl mb-2">📦</span>
                      Manage Products
                    </Button>
                    <Button 
                      className="h-20 flex-col"
                      onClick={() => router.push('/stock')}
                    >
                      <span className="text-2xl mb-2">📊</span>
                      Stock Control
                    </Button>
                    <Button 
                      className="h-20 flex-col"
                      onClick={() => router.push('/orders')}
                    >
                      <span className="text-2xl mb-2">🛒</span>
                      View Orders
                    </Button>
                    <Button 
                      className="h-20 flex-col"
                      onClick={() => router.push('/reports')}
                    >
                      <span className="text-2xl mb-2">📈</span>
                      Reports
                    </Button>
                  </div>
                </Card>

                <Card title="Management" className="lg:col-span-1">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <Button 
                        className="h-20 flex-col"
                        onClick={() => router.push('/users')}
                      >
                        <span className="text-2xl mb-2">👥</span>
                        Manage Users
                      </Button>
                    )}
                    <Button 
                      className="h-20 flex-col"
                      onClick={() => router.push('/attendance')}
                    >
                      <span className="text-2xl mb-2">🕐</span>
                      Attendance
                    </Button>
                    <Button 
                      className="h-20 flex-col"
                      onClick={() => router.push('/reports')}
                    >
                      <span className="text-2xl mb-2">📋</span>
                      Reports
                    </Button>
                    <Button 
                      className="h-20 flex-col"
                      onClick={() => router.push('/products/new')}
                    >
                      <span className="text-2xl mb-2">➕</span>
                      Add Product
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <Card title="Recent Activity">
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">New product "Widget A" added to inventory</span>
                        <span className="text-xs text-gray-400">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Order #1234 completed successfully</span>
                        <span className="text-xs text-gray-400">4 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Low stock alert: "Product B" has only 5 units left</span>
                        <span className="text-xs text-gray-400">6 hours ago</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

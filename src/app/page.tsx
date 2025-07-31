'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Balde de Carnada
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Business Management System
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Please sign in to access the management system
                </p>
                <div className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = '/login'}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/register'}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-2 text-gray-600">
              Here&apos;s an overview of your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card title="Quick Actions" className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="h-20 flex-col"
                  onClick={() => window.location.href = '/products'}
                >
                  <span className="text-lg">📦</span>
                  Manage Products
                </Button>
                <Button 
                  className="h-20 flex-col"
                  onClick={() => window.location.href = '/stock'}
                >
                  <span className="text-lg">📊</span>
                  Stock Control
                </Button>
                <Button 
                  className="h-20 flex-col"
                  onClick={() => window.location.href = '/orders'}
                >
                  <span className="text-lg">🛒</span>
                  View Orders
                </Button>
                <Button 
                  className="h-20 flex-col"
                  onClick={() => window.location.href = '/reports'}
                >
                  <span className="text-lg">📈</span>
                  Reports
                </Button>
              </div>
            </Card>

            <Card title="System Status">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Products</span>
                  <span className="text-sm font-medium">Loading...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Stock Items</span>
                  <span className="text-sm font-medium">Loading...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Orders</span>
                  <span className="text-sm font-medium">Loading...</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

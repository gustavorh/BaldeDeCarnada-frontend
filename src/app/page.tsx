'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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

  // If authenticated, redirect to dashboard
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }

  return <LoadingSpinner />;
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/api/users';
import { User, UserRole, RegisterUserDto } from '@/types/user.d';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function UsersPage() {
  const { user: currentUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserData, setNewUserData] = useState<RegisterUserDto>({
    name: '',
    email: '',
    password: '',
    role: UserRole.EMPLOYEE
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user has permission to manage users
    if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.MANAGER) {
      router.push('/dashboard');
      return;
    }

    loadUsers();
  }, [isAuthenticated, currentUser, router]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersApi.getAllUsers();
      setUsers(response);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesActive = !showActiveOnly || user.isActive;
    
    return matchesSearch && matchesRole && matchesActive;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.password.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      await usersApi.createUser(newUserData);
      await loadUsers();
      setShowCreateForm(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: UserRole.EMPLOYEE
      });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      // TODO: Implement user update API
      // await usersApi.updateUser(userId, { isActive: !isActive });
      console.log(`Toggling user ${userId} status from ${isActive} to ${!isActive}`);
      alert('User update functionality not yet implemented');
      // await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      // TODO: Implement user delete API
      // await usersApi.deleteUser(userId);
      console.log(`Deleting user ${userId}`);
      alert('User delete functionality not yet implemented');
      // await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800';
      case UserRole.EMPLOYEE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.MANAGER) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage system users and their permissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push('/dashboard')}>
                ← Dashboard
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                Add User
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
          {/* Create User Form */}
          {showCreateForm && (
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        required
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        required
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <Input
                        type="password"
                        required
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={newUserData.role}
                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value={UserRole.EMPLOYEE}>Employee</option>
                        <option value={UserRole.MANAGER}>Manager</option>
                        {currentUser?.role === UserRole.ADMIN && (
                          <option value={UserRole.ADMIN}>Admin</option>
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create User
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Search & Filter</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search users
                  </label>
                  <Input
                    type="text"
                    placeholder="Name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole | '')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All roles</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.MANAGER}>Manager</option>
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showActiveOnly}
                      onChange={(e) => setShowActiveOnly(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active users only</span>
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

          {/* Users List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        <div>Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                        <div>Updated: {new Date(user.updatedAt).toLocaleDateString()}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/users/${user.id}`)}
                        >
                          View
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        
                        {currentUser?.role === UserRole.ADMIN && user.id !== currentUser.id && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        )}
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

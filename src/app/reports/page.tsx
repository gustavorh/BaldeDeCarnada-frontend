'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { reportsApi } from '@/api/reports';
import { SalesReport, StockReport, AttendanceReportData, ReportType } from '@/types/reports.d';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ReportsPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(ReportType.SALES);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [stockReport, setStockReport] = useState<StockReport | null>(null);
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, [isAuthenticated, router]);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      switch (selectedReportType) {
        case ReportType.SALES:
          const salesData = await reportsApi.generateSalesReport({ startDate, endDate, type: ReportType.SALES });
          setSalesReport(salesData);
          setStockReport(null);
          setAttendanceReport(null);
          break;
        case ReportType.STOCK:
          const stockData = await reportsApi.generateStockReport();
          setStockReport(stockData);
          setSalesReport(null);
          setAttendanceReport(null);
          break;
        case ReportType.ATTENDANCE:
          const attendanceData = await reportsApi.generateAttendanceReport({ startDate, endDate, type: ReportType.ATTENDANCE });
          setAttendanceReport(attendanceData);
          setSalesReport(null);
          setStockReport(null);
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setIsLoading(false);
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
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="mt-1 text-sm text-gray-500">
                Generate business intelligence reports
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
          {/* Report Generation Form */}
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Report</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Type
                  </label>
                  <select
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value={ReportType.SALES}>Sales Report</option>
                    <option value={ReportType.STOCK}>Stock Report</option>
                    <option value={ReportType.ATTENDANCE}>Attendance Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={generateReport} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Generate Report'}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
            </div>
          </Card>

          {/* Sales Report */}
          {salesReport && (
            <div className="space-y-6">
              <Card title="Sales Summary">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">${salesReport.totalSales.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{salesReport.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">${salesReport.averageOrderValue.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Average Order Value</div>
                  </div>
                </div>
              </Card>

              <Card title="Top Products">
                <div className="mt-4">
                  {salesReport.topProducts.length === 0 ? (
                    <p className="text-gray-500">No sales data available</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity Sold
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {salesReport.topProducts.map((product) => (
                            <tr key={product.productId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.productName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.quantitySold}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${product.totalRevenue.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Stock Report */}
          {stockReport && (
            <div className="space-y-6">
              <Card title="Stock Summary">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stockReport.totalProducts}</div>
                    <div className="text-sm text-gray-600">Total Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">${stockReport.totalStockValue.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Stock Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{stockReport.lowStockItems.length}</div>
                    <div className="text-sm text-gray-600">Low Stock Items</div>
                  </div>
                </div>
              </Card>

              {stockReport.lowStockItems.length > 0 && (
                <Card title="Low Stock Items">
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Min Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stockReport.lowStockItems.map((item) => (
                          <tr key={item.productId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.productName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.currentStock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.minStock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {item.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Attendance Report */}
          {attendanceReport && (
            <div className="space-y-6">
              <Card title="Attendance Summary">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{attendanceReport.totalHours.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{attendanceReport.averageHoursPerEmployee.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Avg Hours per Employee</div>
                  </div>
                </div>
              </Card>

              <Card title="Employee Attendance">
                <div className="mt-4">
                  {attendanceReport.employees.length === 0 ? (
                    <p className="text-gray-500">No attendance data available</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Days Present
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Hours
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Avg Hours/Day
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {attendanceReport.employees.map((employee) => (
                            <tr key={employee.userId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {employee.userName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {employee.daysPresent}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {employee.totalHours.toFixed(1)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {employee.averageHoursPerDay.toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

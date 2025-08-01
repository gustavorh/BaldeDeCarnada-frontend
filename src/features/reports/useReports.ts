'use client';

import { useState } from 'react';
import { reportsApi } from '@/api/reports';
import { 
  SalesReport, 
  StockReport, 
  AttendanceReportData, 
  GenerateReportDto 
} from '@/types/reports';

export function useReports() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSalesReport = async (reportData: GenerateReportDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const report = await reportsApi.generateSalesReport(reportData);
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate sales report';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateStockReport = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const report = await reportsApi.generateStockReport();
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate stock report';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateAttendanceReport = async (reportData: GenerateReportDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const report = await reportsApi.generateAttendanceReport(reportData);
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate attendance report';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    generateSalesReport,
    generateStockReport,
    generateAttendanceReport,
    clearError,
  };
}

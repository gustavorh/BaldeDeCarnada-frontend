'use client';

import { useState } from 'react';
import { attendanceApi } from '@/api/attendance';
import { Attendance, RegisterAttendanceDto } from '@/types/attendance.d';

export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerAttendance = async (attendanceData: RegisterAttendanceDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newAttendance = await attendanceApi.registerAttendance(attendanceData);
      setAttendance(prev => [...prev, newAttendance]);
      return newAttendance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register attendance';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceRecords = async (userId?: string, date?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await attendanceApi.getAttendanceRecords(userId, date);
      setAttendance(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch attendance records';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    attendance,
    isLoading,
    error,
    registerAttendance,
    fetchAttendanceRecords,
    clearError,
  };
}

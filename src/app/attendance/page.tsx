'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceApi } from '@/api/attendance';
import { Attendance, AttendanceType } from '@/types/attendance';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AttendancePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadAttendanceData();
  }, [isAuthenticated, router]);

  const loadAttendanceData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Get user's attendance records
      const userAttendances = await attendanceApi.getAttendanceRecords(user.id);
      setAttendances(userAttendances);
      
      // Check if user is currently clocked in
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = userAttendances.find((att: Attendance) => att.date === today);
      
      if (todayRecord) {
        setTodayAttendance(todayRecord);
        setIsClockedIn(!!todayRecord.clockIn && !todayRecord.clockOut);
      } else {
        setTodayAttendance(null);
        setIsClockedIn(false);
      }
      
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockIn = async () => {
    if (!user) return;

    try {
      await attendanceApi.registerAttendance({
        userId: user.id,
        type: AttendanceType.CLOCK_IN
      });
      
      await loadAttendanceData();
    } catch (err: any) {
      setError(err.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    if (!user) return;

    try {
      await attendanceApi.registerAttendance({
        userId: user.id,
        type: AttendanceType.CLOCK_OUT
      });
      
      await loadAttendanceData();
    } catch (err: any) {
      setError(err.message || 'Failed to clock out');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateHoursWorked = (attendance: Attendance) => {
    if (!attendance.clockIn || !attendance.clockOut) return 0;
    
    const clockIn = new Date(attendance.clockIn);
    const clockOut = new Date(attendance.clockOut);
    const diffMs = clockOut.getTime() - clockIn.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
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
              <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your work hours and attendance
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
          {/* Current Status */}
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Status</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: <span className={`font-medium ${isClockedIn ? 'text-green-600' : 'text-red-600'}`}>
                      {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                    </span>
                  </div>
                  
                  {todayAttendance && (
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {todayAttendance.clockIn && (
                        <div>Clock In: {formatTime(todayAttendance.clockIn)}</div>
                      )}
                      {todayAttendance.clockOut && (
                        <div>Clock Out: {formatTime(todayAttendance.clockOut)}</div>
                      )}
                      {todayAttendance.clockIn && todayAttendance.clockOut && (
                        <div className="font-medium text-blue-600">
                          Hours Worked: {calculateHoursWorked(todayAttendance)}h
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  {!isClockedIn ? (
                    <Button onClick={handleClockIn} className="bg-green-600 hover:bg-green-700">
                      Clock In
                    </Button>
                  ) : (
                    <Button onClick={handleClockOut} className="bg-red-600 hover:bg-red-700">
                      Clock Out
                    </Button>
                  )}
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

          {/* Attendance History */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance History</h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <LoadingSpinner />
                </div>
              ) : attendances.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No attendance records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clock In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clock Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hours Worked
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendances.slice().reverse().map((attendance) => (
                        <tr key={attendance.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(attendance.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attendance.clockIn ? formatTime(attendance.clockIn) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attendance.clockOut ? formatTime(attendance.clockOut) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attendance.clockIn && attendance.clockOut 
                              ? `${calculateHoursWorked(attendance)}h`
                              : '-'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              attendance.clockIn && attendance.clockOut
                                ? 'bg-green-100 text-green-800'
                                : attendance.clockIn
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {attendance.clockIn && attendance.clockOut
                                ? 'Complete'
                                : attendance.clockIn
                                ? 'In Progress'
                                : 'No Clock In'
                              }
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Card title="This Week">
              <div className="mt-2">
                <div className="text-2xl font-bold text-blue-600">
                  {attendances
                    .filter(att => {
                      const attDate = new Date(att.date);
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      return attDate >= weekStart && att.clockIn && att.clockOut;
                    })
                    .reduce((total, att) => total + calculateHoursWorked(att), 0)
                    .toFixed(1)}h
                </div>
                <p className="text-sm text-gray-600">Hours worked</p>
              </div>
            </Card>

            <Card title="This Month">
              <div className="mt-2">
                <div className="text-2xl font-bold text-green-600">
                  {attendances
                    .filter(att => {
                      const attDate = new Date(att.date);
                      const monthStart = new Date();
                      monthStart.setDate(1);
                      return attDate >= monthStart && att.clockIn && att.clockOut;
                    })
                    .reduce((total, att) => total + calculateHoursWorked(att), 0)
                    .toFixed(1)}h
                </div>
                <p className="text-sm text-gray-600">Hours worked</p>
              </div>
            </Card>

            <Card title="Days Present">
              <div className="mt-2">
                <div className="text-2xl font-bold text-purple-600">
                  {attendances.filter(att => att.clockIn).length}
                </div>
                <p className="text-sm text-gray-600">Total days</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { httpService } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { ApiResponseDto } from '@/types/api';
import { Attendance, RegisterAttendanceDto } from '@/types/attendance';

export class AttendanceApi {
  async registerAttendance(attendanceData: RegisterAttendanceDto): Promise<Attendance> {
    const response = await httpService.post<ApiResponseDto<Attendance>>(
      API_ENDPOINTS.ATTENDANCE.REGISTER,
      attendanceData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to register attendance');
  }

  async getAttendanceRecords(userId?: string, date?: string): Promise<Attendance[]> {
    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('userId', userId);
    if (date) queryParams.append('date', date);

    const url = `${API_ENDPOINTS.ATTENDANCE.BASE}?${queryParams.toString()}`;
    const response = await httpService.get<ApiResponseDto<Attendance[]>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch attendance records');
  }
}

export const attendanceApi = new AttendanceApi();

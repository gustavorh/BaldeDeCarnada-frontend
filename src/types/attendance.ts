import { User } from './user';

export interface Attendance {
  id: string;
  userId: string;
  clockIn: string;
  clockOut?: string;
  date: string;
  hoursWorked?: number;
  user?: User;
}

export interface RegisterAttendanceDto {
  userId: string;
  type: AttendanceType;
}

export enum AttendanceType {
  CLOCK_IN = 'clock_in',
  CLOCK_OUT = 'clock_out',
}

export interface AttendanceReport {
  userId: string;
  userName: string;
  totalHours: number;
  daysWorked: number;
  attendances: Attendance[];
}

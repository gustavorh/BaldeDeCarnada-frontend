import { z } from 'zod';
import { AttendanceType } from '@/types/attendance';

export const registerAttendanceSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.nativeEnum(AttendanceType),
});

export type RegisterAttendanceFormData = z.infer<typeof registerAttendanceSchema>;

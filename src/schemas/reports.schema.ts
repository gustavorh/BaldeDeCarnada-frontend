import { z } from 'zod';
import { ReportType } from '@/types/reports.d';

export const generateReportSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  type: z.nativeEnum(ReportType),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return startDate <= endDate;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type GenerateReportFormData = z.infer<typeof generateReportSchema>;

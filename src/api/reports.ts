import { httpService } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { ApiResponseDto } from '@/types/api.d';
import { 
  SalesReport, 
  StockReport, 
  AttendanceReportData, 
  GenerateReportDto 
} from '@/types/reports.d';

export class ReportsApi {
  async generateSalesReport(reportData: GenerateReportDto): Promise<SalesReport> {
    const response = await httpService.post<ApiResponseDto<SalesReport>>(
      API_ENDPOINTS.REPORTS.SALES,
      reportData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to generate sales report');
  }

  async generateStockReport(): Promise<StockReport> {
    const response = await httpService.get<ApiResponseDto<StockReport>>(
      API_ENDPOINTS.REPORTS.STOCK
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to generate stock report');
  }

  async generateAttendanceReport(reportData: GenerateReportDto): Promise<AttendanceReportData> {
    const response = await httpService.post<ApiResponseDto<AttendanceReportData>>(
      API_ENDPOINTS.REPORTS.ATTENDANCE,
      reportData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to generate attendance report');
  }
}

export const reportsApi = new ReportsApi();

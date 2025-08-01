export interface SalesReport {
  period: ReportPeriod;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: ProductSales[];
  salesByDate: SalesByDate[];
}

export interface ProductSales {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface SalesByDate {
  date: string;
  sales: number;
  orders: number;
}

export interface StockReport {
  lowStockItems: StockReportItem[];
  totalProducts: number;
  totalStockValue: number;
  stockByCategory: StockByCategory[];
}

export interface StockReportItem {
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  status: StockStatus;
}

export interface StockByCategory {
  category: string;
  totalItems: number;
  totalValue: number;
}

export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export interface AttendanceReportData {
  period: ReportPeriod;
  employees: AttendanceReport[];
  totalHours: number;
  averageHoursPerEmployee: number;
}

export interface ReportPeriod {
  startDate: string;
  endDate: string;
}

export interface GenerateReportDto {
  startDate: string;
  endDate: string;
  type: ReportType;
}

export enum ReportType {
  SALES = 'sales',
  STOCK = 'stock',
  ATTENDANCE = 'attendance',
}

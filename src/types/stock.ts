import { Product } from './product';

export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  lastUpdated: string;
  product?: Product;
}

export interface UpdateStockDto {
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface StockMovement {
  id: string;
  stockId: string;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  createdAt: string;
  createdBy: string;
}

export enum StockMovementType {
  INCREASE = 'increase',
  DECREASE = 'decrease',
  ADJUSTMENT = 'adjustment',
}

export interface IncreaseStockDto {
  productId: string;
  quantity: number;
  reason?: string;
}

export interface DecreaseStockDto {
  productId: string;
  quantity: number;
  reason?: string;
}

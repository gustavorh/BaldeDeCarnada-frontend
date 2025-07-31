import { z } from 'zod';

export const updateStockSchema = z.object({
  quantity: z.number().nonnegative('Quantity cannot be negative'),
  minQuantity: z.number().nonnegative('Minimum quantity cannot be negative').optional(),
  maxQuantity: z.number().positive('Maximum quantity must be positive').optional(),
});

export const increaseStockSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be positive'),
  reason: z.string().optional(),
});

export const decreaseStockSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be positive'),
  reason: z.string().optional(),
});

export type UpdateStockFormData = z.infer<typeof updateStockSchema>;
export type IncreaseStockFormData = z.infer<typeof increaseStockSchema>;
export type DecreaseStockFormData = z.infer<typeof decreaseStockSchema>;

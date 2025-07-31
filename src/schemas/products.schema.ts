import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  isActive: z.boolean().optional(),
});

export const productSearchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().max(100).optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type ProductSearchFormData = z.infer<typeof productSearchSchema>;

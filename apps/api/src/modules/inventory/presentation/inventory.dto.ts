import { z } from 'zod';

export const rechargeStockSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
});

export const adjustStockSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
});

export type RechargeStockDTO = z.infer<typeof rechargeStockSchema>;
export type AdjustStockDTO = z.infer<typeof adjustStockSchema>;

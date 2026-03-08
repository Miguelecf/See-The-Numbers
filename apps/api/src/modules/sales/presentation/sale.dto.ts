import { z } from 'zod';

export const createSaleItemSchema = z.object({
  type: z.enum(['PRODUCT', 'SERVICE']),
  referenceId: z.string().min(1, 'Reference ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  discountPercent: z.number().min(0).max(100).optional(),
});

export const createSaleSchema = z.object({
  items: z.array(createSaleItemSchema).min(1, 'At least one sale item is required'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
  cartDiscountPercent: z.number().min(0).max(100).optional(),
  customerAlias: z.string().trim().max(80).optional(),
  notes: z.string().optional(),
});

export type CreateSaleDTO = z.infer<typeof createSaleSchema>;

import { z } from 'zod';

export const costItemSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Cost item name is required'),
  category: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  notes: z.string().optional(),
});

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  category: z.string().optional(),
  salePrice: z.number().positive('Sale price must be greater than 0'),
  estimatedDurationMinutes: z.number().int().positive('Duration must be greater than 0'),
  laborCost: z.number().min(0, 'Labor cost must be positive').default(0),
  costItems: z.array(costItemSchema).default([]),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceDTO = z.infer<typeof createServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>;

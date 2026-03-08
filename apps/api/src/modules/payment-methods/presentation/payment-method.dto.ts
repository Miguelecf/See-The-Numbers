import { z } from 'zod';

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().optional(),
});

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

export type CreatePaymentMethodDTO = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodDTO = z.infer<typeof updatePaymentMethodSchema>;

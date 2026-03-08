import { z } from 'zod';

export const costItemSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.string().optional(),
  amount: z.coerce.number().min(0, 'El monto debe ser positivo'),
  notes: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.string().optional(),
  salePrice: z.coerce.number().positive('El precio debe ser mayor a 0'),
  estimatedDurationMinutes: z.coerce.number().int().positive('La duración debe ser mayor a 0'),
  laborCost: z.coerce.number().min(0, 'El costo de mano de obra debe ser positivo'),
  costItems: z.array(costItemSchema).default([]),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

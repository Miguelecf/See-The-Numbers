import { z } from 'zod';

export const productSchema = z.object({
  barcode: z.string().optional(),
  sku: z.string().min(1, 'El SKU es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  supplier: z.string().min(1, 'El proveedor es requerido'),
  unitOfMeasure: z.string().min(1, 'La unidad es requerida'),
  cost: z.coerce.number().min(0, 'El costo no puede ser negativo'),
  quantity: z.coerce.number().int().min(0, 'La cantidad debe ser positiva'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  category: z.string().optional(),
  laboratory: z.string().min(1, 'El laboratorio es requerido'),
  stockMinimum: z.coerce.number().int().min(0, 'El stock mínimo debe ser positivo').optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

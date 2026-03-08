import { z } from 'zod';

export const createProductSchema = z.object({
  barcode: z.string().trim().min(1).optional(),
  sku: z.string().trim().min(1, 'SKU is required'),
  name: z.string().min(1, 'Product name is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  quantity: z.number().int().min(0, 'Quantity must be positive').default(0),
  price: z.number().positive('Price must be greater than 0'),
  category: z.string().optional(),
  laboratory: z.string().min(1, 'Laboratory is required'),
  stockMinimum: z.number().int().min(0, 'Stock minimum must be positive').optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  supplier: z.string().optional(),
  laboratory: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  search: z.string().optional(),
});

export const confirmImportProductsSchema = z.object({
  replaceSkus: z
    .union([
      z.array(z.string()),
      z.string().transform((value) => {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }),
      z.undefined(),
    ])
    .transform((value) => (Array.isArray(value) ? value : [])),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type ProductFiltersDTO = z.infer<typeof productFiltersSchema>;
export type ConfirmImportProductsDTO = z.infer<typeof confirmImportProductsSchema>;

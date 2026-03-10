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
  discountMode: z.enum(['NONE', 'ITEM', 'CART']).optional().default('NONE'),
  cartDiscountPercent: z.number().min(0).max(100).optional(),
  customerAlias: z.string().trim().max(80).optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  const hasItemDiscount = data.items.some((item) => (item.discountPercent ?? 0) > 0);
  const hasCartDiscount = (data.cartDiscountPercent ?? 0) > 0;

  if (hasItemDiscount && hasCartDiscount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Use either item discount or cart discount, not both in the same sale',
      path: ['cartDiscountPercent'],
    });
  }

  if (data.discountMode === 'ITEM' && hasCartDiscount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cart discount is not allowed when discount mode is ITEM',
      path: ['cartDiscountPercent'],
    });
  }

  if (data.discountMode === 'CART' && hasItemDiscount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Item discounts are not allowed when discount mode is CART',
      path: ['items'],
    });
  }
});

export type CreateSaleDTO = z.infer<typeof createSaleSchema>;

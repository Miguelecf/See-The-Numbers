import { Product } from '@/modules/products/types/product.types';

export interface StockMovement {
  _id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryOperationResult {
  product: Product;
  movement: StockMovement;
  delta?: number;
}

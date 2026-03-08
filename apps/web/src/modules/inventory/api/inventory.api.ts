import { apiClient } from '@/shared/lib/api-client';
import { InventoryOperationResult, StockMovement } from '../types/inventory.types';

export interface RechargeStockInput {
  productId: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface AdjustStockInput {
  productId: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export const inventoryApi = {
  rechargeStock: (data: RechargeStockInput) =>
    apiClient.post<InventoryOperationResult>('/api/inventory/recharge', data),
  adjustStock: (data: AdjustStockInput) =>
    apiClient.post<InventoryOperationResult>('/api/inventory/adjust', data),
  getMovements: (productId: string) => apiClient.get<StockMovement[]>(`/api/inventory/movements/${productId}`),
};

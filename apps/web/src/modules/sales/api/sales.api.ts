import { apiClient } from '@/shared/lib/api-client';
import { CreateSaleInput, Sale } from '../types/sales.types';

export const salesApi = {
  getAll: (customerAlias?: string) => {
    const query = customerAlias ? `?customerAlias=${encodeURIComponent(customerAlias)}` : '';
    return apiClient.get<Sale[]>(`/api/sales${query}`);
  },
  getById: (id: string) => apiClient.get<Sale>(`/api/sales/${id}`),
  create: (data: CreateSaleInput) => apiClient.post<Sale>('/api/sales', data),
};

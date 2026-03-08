import { apiClient } from '@/shared/lib/api-client';
import { PaymentMethod } from '../types/payment-method.types';

export interface PaymentMethodInput {
  name: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const paymentMethodsApi = {
  getAll: () => apiClient.get<PaymentMethod[]>('/api/payment-methods'),
  create: (data: PaymentMethodInput) => apiClient.post<PaymentMethod>('/api/payment-methods', data),
  update: (id: string, data: Partial<PaymentMethodInput>) =>
    apiClient.put<PaymentMethod>(`/api/payment-methods/${id}`, data),
  toggleActive: (id: string) => apiClient.patch<PaymentMethod>(`/api/payment-methods/${id}/toggle-active`),
};

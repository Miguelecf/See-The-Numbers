import { apiClient } from '@/shared/lib/api-client';
import { Service } from '../types/service.types';
import { ServiceFormData } from '../schemas/service.schema';

export const servicesApi = {
  getAll: () => apiClient.get<Service[]>('/api/services'),
  getById: (id: string) => apiClient.get<Service>(`/api/services/${id}`),
  create: (data: ServiceFormData) => apiClient.post<Service>('/api/services', data),
  update: (id: string, data: Partial<ServiceFormData>) => apiClient.put<Service>(`/api/services/${id}`, data),
  toggleActive: (id: string) => apiClient.patch<Service>(`/api/services/${id}/toggle-active`),
};

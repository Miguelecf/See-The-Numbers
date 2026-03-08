import { apiClient } from '@/shared/lib/api-client';
import {
  Product,
  ProductFilters,
  ProductImportConfirmResult,
  ProductImportPreviewResult,
} from '../types/product.types';
import { ProductFormData } from '../schemas/product.schema';

const toQueryString = (filters?: ProductFilters) => {
  if (!filters) return '';

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : '';
};

export const productsApi = {
  getAll: (filters?: ProductFilters) => apiClient.get<Product[]>(`/api/products${toQueryString(filters)}`),
  getById: (id: string) => apiClient.get<Product>(`/api/products/${id}`),
  create: (data: ProductFormData) => apiClient.post<Product>('/api/products', data),
  update: (id: string, data: Partial<ProductFormData>) => apiClient.put<Product>(`/api/products/${id}`, data),
  toggleActive: (id: string) => apiClient.patch<Product>(`/api/products/${id}/toggle-active`),
  previewImport: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.postForm<ProductImportPreviewResult>('/api/products/import/preview', formData);
  },
  confirmImport: (file: File, replaceSkus: string[]) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('replaceSkus', JSON.stringify(replaceSkus));
    return apiClient.postForm<ProductImportConfirmResult>('/api/products/import/confirm', formData);
  },
};

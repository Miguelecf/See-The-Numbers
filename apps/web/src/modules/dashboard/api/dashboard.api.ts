import { apiClient } from '@/shared/lib/api-client';
import { DashboardSummary } from '../types/dashboard.types';

export const dashboardApi = {
  getSummary: () => apiClient.get<DashboardSummary>('/api/dashboard/summary'),
};

import { apiClient } from '@/shared/lib/api-client';
import { Insight } from '../types/insight.types';

export const insightsApi = {
  getAll: () => apiClient.get<Insight[]>('/api/insights'),
};

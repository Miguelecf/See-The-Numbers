import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../api/insights.api';

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: insightsApi.getAll,
  });
}

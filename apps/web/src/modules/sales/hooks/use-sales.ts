import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateSaleInput } from '../types/sales.types';
import { salesApi } from '../api/sales.api';

export function useSales(customerAlias?: string) {
  return useQuery({
    queryKey: ['sales', customerAlias],
    queryFn: () => salesApi.getAll(customerAlias),
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleInput) => salesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}

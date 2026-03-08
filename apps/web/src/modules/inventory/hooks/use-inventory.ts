import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdjustStockInput, inventoryApi, RechargeStockInput } from '../api/inventory.api';

export function useStockMovements(productId: string) {
  return useQuery({
    queryKey: ['stock-movements', productId],
    queryFn: () => inventoryApi.getMovements(productId),
    enabled: !!productId,
  });
}

export function useRechargeStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RechargeStockInput) => inventoryApi.rechargeStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements', variables.productId] });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdjustStockInput) => inventoryApi.adjustStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements', variables.productId] });
    },
  });
}

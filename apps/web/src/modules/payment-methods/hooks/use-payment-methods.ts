import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentMethodsApi, PaymentMethodInput } from '../api/payment-methods.api';

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: paymentMethodsApi.getAll,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentMethodInput) => paymentMethodsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

export function useTogglePaymentMethodActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

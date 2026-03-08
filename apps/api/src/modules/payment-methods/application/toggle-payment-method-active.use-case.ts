import { PaymentMethodRepository } from '../infrastructure/payment-method.repository';

export const togglePaymentMethodActiveUseCase = async (
  repository: PaymentMethodRepository,
  id: string
) => {
  return repository.toggleActive(id);
};

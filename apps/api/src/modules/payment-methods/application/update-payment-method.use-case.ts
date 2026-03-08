import { PaymentMethodRepository } from '../infrastructure/payment-method.repository';
import { PaymentMethod } from '../domain/payment-method.entity';

export const updatePaymentMethodUseCase = async (
  repository: PaymentMethodRepository,
  id: string,
  data: Partial<PaymentMethod>
) => {
  return repository.update(id, data);
};

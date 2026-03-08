import { PaymentMethodRepository } from '../infrastructure/payment-method.repository';
import { PaymentMethod } from '../domain/payment-method.entity';

export const createPaymentMethodUseCase = async (
  repository: PaymentMethodRepository,
  data: Omit<PaymentMethod, '_id' | 'createdAt' | 'updatedAt'>
) => {
  return repository.create(data);
};

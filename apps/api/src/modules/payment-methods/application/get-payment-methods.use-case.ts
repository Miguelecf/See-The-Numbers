import { PaymentMethodRepository } from '../infrastructure/payment-method.repository';

export const getPaymentMethodsUseCase = async (repository: PaymentMethodRepository) => {
  return repository.findAll();
};

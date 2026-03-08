import { SaleRepository } from '../infrastructure/sale.repository';

export const getSaleByIdUseCase = async (repository: SaleRepository, id: string) => {
  return repository.findById(id);
};

import { SaleRepository } from '../infrastructure/sale.repository';

export const getSalesUseCase = async (repository: SaleRepository, customerAliasSearch?: string) => {
  return repository.findAll(100, customerAliasSearch);
};

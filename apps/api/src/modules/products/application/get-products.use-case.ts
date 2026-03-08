import { ProductRepository } from '../infrastructure/product.repository';
import { ProductFilters, ProductWithCalculations } from '../domain/product.entity';
import { enrichProductWithCalculations } from '../domain/product.calculations';

export const getProductsUseCase = async (
  repository: ProductRepository,
  filters: ProductFilters = {}
): Promise<ProductWithCalculations[]> => {
  const products = await repository.findAll(filters);
  return products.map(enrichProductWithCalculations);
};

import { ProductRepository } from '../infrastructure/product.repository';
import { ProductWithCalculations } from '../domain/product.entity';
import { enrichProductWithCalculations } from '../domain/product.calculations';

export const toggleProductActiveUseCase = async (
  repository: ProductRepository,
  id: string
): Promise<ProductWithCalculations> => {
  const product = await repository.toggleActive(id);
  return enrichProductWithCalculations(product);
};

import { ProductRepository } from '../infrastructure/product.repository';
import { ProductWithCalculations } from '../domain/product.entity';
import { enrichProductWithCalculations } from '../domain/product.calculations';

export const getProductByIdUseCase = async (
  repository: ProductRepository,
  id: string
): Promise<ProductWithCalculations> => {
  const product = await repository.findById(id);
  return enrichProductWithCalculations(product);
};

import { ProductRepository } from '../infrastructure/product.repository';
import { Product, ProductWithCalculations } from '../domain/product.entity';
import { enrichProductWithCalculations } from '../domain/product.calculations';
import { BadRequestError } from '../../../shared/errors/app-error';

export const updateProductUseCase = async (
  repository: ProductRepository,
  id: string,
  data: Partial<Product>
): Promise<ProductWithCalculations> => {
  if (data.price !== undefined && data.price <= 0) {
    throw new BadRequestError('Price must be greater than 0');
  }

  if (data.cost !== undefined && data.cost < 0) {
    throw new BadRequestError('Cost cannot be negative');
  }

  if (data.quantity !== undefined && data.quantity < 0) {
    throw new BadRequestError('Quantity cannot be negative');
  }

  const product = await repository.update(id, data);
  return enrichProductWithCalculations(product);
};

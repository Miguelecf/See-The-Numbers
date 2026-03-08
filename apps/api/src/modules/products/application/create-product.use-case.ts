import { ProductRepository } from '../infrastructure/product.repository';
import { Product, ProductWithCalculations } from '../domain/product.entity';
import { enrichProductWithCalculations } from '../domain/product.calculations';
import { BadRequestError } from '../../../shared/errors/app-error';

export const createProductUseCase = async (
  repository: ProductRepository,
  data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
): Promise<ProductWithCalculations> => {
  if (data.price <= 0) {
    throw new BadRequestError('Price must be greater than 0');
  }

  if (data.cost < 0) {
    throw new BadRequestError('Cost cannot be negative');
  }

  if (data.quantity < 0) {
    throw new BadRequestError('Quantity cannot be negative');
  }

  const product = await repository.create(data);
  return enrichProductWithCalculations(product);
};

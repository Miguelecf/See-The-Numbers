import { BadRequestError } from '../../../shared/errors/app-error';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { StockMovementRepository } from '../infrastructure/stock-movement.repository';

export const adjustStockUseCase = async (
  productRepository: ProductRepository,
  movementRepository: StockMovementRepository,
  data: { productId: string; quantity: number; reason: string; notes?: string }
) => {
  if (data.quantity < 0) {
    throw new BadRequestError('Adjusted quantity cannot be negative');
  }

  const product = await productRepository.findById(data.productId);
  const delta = data.quantity - product.quantity;

  if (delta === 0) {
    throw new BadRequestError('Adjusted quantity is the same as current quantity');
  }

  const updatedProduct = await productRepository.setQuantity(data.productId, data.quantity);
  const movement = await movementRepository.create({
    productId: data.productId,
    type: 'ADJUSTMENT',
    quantity: Math.abs(delta),
    reason: data.reason,
    notes: data.notes,
    referenceType: 'MANUAL',
  });

  return { product: updatedProduct, movement, delta };
};

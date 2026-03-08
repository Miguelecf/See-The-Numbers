import { BadRequestError } from '../../../shared/errors/app-error';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { StockMovementRepository } from '../infrastructure/stock-movement.repository';

export const rechargeStockUseCase = async (
  productRepository: ProductRepository,
  movementRepository: StockMovementRepository,
  data: { productId: string; quantity: number; reason: string; notes?: string }
) => {
  if (data.quantity <= 0) {
    throw new BadRequestError('Quantity must be greater than 0');
  }

  const product = await productRepository.findById(data.productId);
  const updatedProduct = await productRepository.setQuantity(data.productId, product.quantity + data.quantity);

  const movement = await movementRepository.create({
    productId: data.productId,
    type: 'IN',
    quantity: data.quantity,
    reason: data.reason,
    notes: data.notes,
    referenceType: 'MANUAL',
  });

  return { product: updatedProduct, movement };
};

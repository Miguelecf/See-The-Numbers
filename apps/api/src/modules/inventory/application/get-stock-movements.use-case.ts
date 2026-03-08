import { StockMovementRepository } from '../infrastructure/stock-movement.repository';

export const getStockMovementsUseCase = async (
  movementRepository: StockMovementRepository,
  productId: string
) => {
  return movementRepository.findByProductId(productId);
};

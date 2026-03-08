import { NextFunction, Request, Response } from 'express';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { StockMovementRepository } from '../infrastructure/stock-movement.repository';
import { adjustStockUseCase } from '../application/adjust-stock.use-case';
import { rechargeStockUseCase } from '../application/recharge-stock.use-case';
import { getStockMovementsUseCase } from '../application/get-stock-movements.use-case';
import { adjustStockSchema, rechargeStockSchema } from './inventory.dto';

const productRepository = new ProductRepository();
const movementRepository = new StockMovementRepository();

export const rechargeStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = rechargeStockSchema.parse(req.body);
    const result = await rechargeStockUseCase(productRepository, movementRepository, validated);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = adjustStockSchema.parse(req.body);
    const result = await adjustStockUseCase(productRepository, movementRepository, validated);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getStockMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getStockMovementsUseCase(movementRepository, req.params.productId);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

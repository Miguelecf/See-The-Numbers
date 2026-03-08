import { Request, Response, NextFunction } from 'express';
import { ServiceRepository } from '../../services/infrastructure/service.repository';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { SaleRepository } from '../../sales/infrastructure/sale.repository';
import { getDashboardSummaryUseCase } from '../application/get-dashboard-summary.use-case';

const serviceRepository = new ServiceRepository();
const productRepository = new ProductRepository();
const saleRepository = new SaleRepository();

export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await getDashboardSummaryUseCase(
      serviceRepository,
      productRepository,
      saleRepository
    );
    res.json({ status: 'success', data: summary });
  } catch (error) {
    next(error);
  }
};

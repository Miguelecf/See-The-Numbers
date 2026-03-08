import { Request, Response, NextFunction } from 'express';
import { ServiceRepository } from '../../services/infrastructure/service.repository';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { SaleRepository } from '../../sales/infrastructure/sale.repository';
import { getInsightsUseCase } from '../application/get-insights.use-case';

const serviceRepository = new ServiceRepository();
const productRepository = new ProductRepository();
const saleRepository = new SaleRepository();

export const getInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insights = await getInsightsUseCase(serviceRepository, productRepository, saleRepository);
    res.json({ status: 'success', data: insights });
  } catch (error) {
    next(error);
  }
};

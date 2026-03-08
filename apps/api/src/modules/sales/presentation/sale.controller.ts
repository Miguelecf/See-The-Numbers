import { NextFunction, Request, Response } from 'express';
import { createSaleUseCase } from '../application/create-sale.use-case';
import { getSalesUseCase } from '../application/get-sales.use-case';
import { getSaleByIdUseCase } from '../application/get-sale-by-id.use-case';
import { generateInvoicePdfUseCase } from '../application/generate-invoice-pdf.use-case';
import { SaleRepository } from '../infrastructure/sale.repository';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { ServiceRepository } from '../../services/infrastructure/service.repository';
import { PaymentMethodRepository } from '../../payment-methods/infrastructure/payment-method.repository';
import { StockMovementRepository } from '../../inventory/infrastructure/stock-movement.repository';
import { createSaleSchema } from './sale.dto';

const saleRepository = new SaleRepository();
const productRepository = new ProductRepository();
const serviceRepository = new ServiceRepository();
const paymentMethodRepository = new PaymentMethodRepository();
const stockMovementRepository = new StockMovementRepository();

export const getSales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerAliasSearch = typeof req.query.customerAlias === 'string'
      ? req.query.customerAlias
      : undefined;
    const data = await getSalesUseCase(saleRepository, customerAliasSearch);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getSaleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getSaleByIdUseCase(saleRepository, req.params.id);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getSaleInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeName = typeof req.query.storeName === 'string' ? req.query.storeName : undefined;
    const doc = await generateInvoicePdfUseCase(saleRepository, req.params.id, storeName);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura-${req.params.id}.pdf`);
    
    doc.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createSaleSchema.parse(req.body);
    const data = await createSaleUseCase(
      saleRepository,
      productRepository,
      serviceRepository,
      paymentMethodRepository,
      stockMovementRepository,
      validated
    );
    res.status(201).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

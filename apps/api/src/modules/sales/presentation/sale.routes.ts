import { Router } from 'express';
import * as saleController from './sale.controller';

const router = Router();

router.get('/', saleController.getSales);
router.get('/:id', saleController.getSaleById);
router.get('/:id/invoice', saleController.getSaleInvoice);
router.post('/', saleController.createSale);

export default router;

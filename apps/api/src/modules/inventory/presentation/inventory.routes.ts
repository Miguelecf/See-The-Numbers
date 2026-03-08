import { Router } from 'express';
import * as inventoryController from './inventory.controller';

const router = Router();

router.post('/recharge', inventoryController.rechargeStock);
router.post('/adjust', inventoryController.adjustStock);
router.get('/movements/:productId', inventoryController.getStockMovements);

export default router;

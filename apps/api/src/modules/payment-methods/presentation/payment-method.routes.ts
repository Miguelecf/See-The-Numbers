import { Router } from 'express';
import * as paymentMethodController from './payment-method.controller';

const router = Router();

router.get('/', paymentMethodController.getPaymentMethods);
router.post('/', paymentMethodController.createPaymentMethod);
router.put('/:id', paymentMethodController.updatePaymentMethod);
router.patch('/:id/toggle-active', paymentMethodController.togglePaymentMethodActive);

export default router;

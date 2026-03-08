import { Router } from 'express';
import * as serviceController from './service.controller';

const router = Router();

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.patch('/:id/toggle-active', serviceController.toggleServiceActive);

export default router;

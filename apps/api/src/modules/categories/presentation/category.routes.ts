import { Router } from 'express';
import * as categoryController from './category.controller';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

export default router;

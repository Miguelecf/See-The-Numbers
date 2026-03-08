import { Router } from 'express';
import multer from 'multer';
import * as productController from './product.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', productController.getProducts);
router.post('/import/preview', upload.single('file'), productController.previewImportProducts);
router.post('/import/confirm', upload.single('file'), productController.confirmImportProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.patch('/:id/toggle-active', productController.toggleProductActive);

export default router;

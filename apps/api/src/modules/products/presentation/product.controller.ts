import { Request, Response, NextFunction } from 'express';
import { ProductRepository } from '../infrastructure/product.repository';
import { CategoryRepository } from '../../categories/infrastructure/category.repository';
import { getProductsUseCase } from '../application/get-products.use-case';
import { getProductByIdUseCase } from '../application/get-product-by-id.use-case';
import { createProductUseCase } from '../application/create-product.use-case';
import { updateProductUseCase } from '../application/update-product.use-case';
import { toggleProductActiveUseCase } from '../application/toggle-product-active.use-case';
import {
  confirmProductsImportUseCase,
  previewProductsImportUseCase,
} from '../application/import-products-from-file.use-case';
import {
  confirmImportProductsSchema,
  createProductSchema,
  productFiltersSchema,
  updateProductSchema,
} from './product.dto';
import { BadRequestError } from '../../../shared/errors/app-error';

const repository = new ProductRepository();
const categoryRepository = new CategoryRepository();

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = productFiltersSchema.parse(req.query);
    const products = await getProductsUseCase(repository, filters);
    res.json({ status: 'success', data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductByIdUseCase(repository, req.params.id);
    res.json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createProductSchema.parse(req.body);
    const product = await createProductUseCase(repository, validated);
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = updateProductSchema.parse(req.body);
    const product = await updateProductUseCase(repository, req.params.id, validated);
    res.json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const toggleProductActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await toggleProductActiveUseCase(repository, req.params.id);
    res.json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const previewImportProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = (req as Request & { file?: Express.Multer.File }).file;

    if (!file || !file.buffer) {
      throw new BadRequestError('Import file is required');
    }

    const result = await previewProductsImportUseCase(repository, file.buffer);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const confirmImportProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = (req as Request & { file?: Express.Multer.File }).file;

    if (!file || !file.buffer) {
      throw new BadRequestError('Import file is required');
    }

    const { replaceSkus } = confirmImportProductsSchema.parse(req.body);
    const result = await confirmProductsImportUseCase(repository, categoryRepository, file.buffer, replaceSkus);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

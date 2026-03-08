import { Request, Response, NextFunction } from 'express';
import { CategoryRepository } from '../infrastructure/category.repository';

const repository = new CategoryRepository();

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parentId = typeof req.query.parentId === 'string' ? req.query.parentId : null;
    const categories = await repository.findAll(parentId);
    res.json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await repository.findById(req.params.id);
    res.json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

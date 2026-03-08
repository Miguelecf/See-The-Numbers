import { NextFunction, Request, Response } from 'express';
import { PaymentMethodRepository } from '../infrastructure/payment-method.repository';
import { getPaymentMethodsUseCase } from '../application/get-payment-methods.use-case';
import { createPaymentMethodUseCase } from '../application/create-payment-method.use-case';
import { updatePaymentMethodUseCase } from '../application/update-payment-method.use-case';
import { togglePaymentMethodActiveUseCase } from '../application/toggle-payment-method-active.use-case';
import { createPaymentMethodSchema, updatePaymentMethodSchema } from './payment-method.dto';

const repository = new PaymentMethodRepository();

export const getPaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getPaymentMethodsUseCase(repository);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createPaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createPaymentMethodSchema.parse(req.body);
    const data = await createPaymentMethodUseCase(repository, validated);
    res.status(201).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = updatePaymentMethodSchema.parse(req.body);
    const data = await updatePaymentMethodUseCase(repository, req.params.id, validated);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const togglePaymentMethodActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await togglePaymentMethodActiveUseCase(repository, req.params.id);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

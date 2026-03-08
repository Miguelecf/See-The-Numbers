import { Request, Response, NextFunction } from 'express';
import { ServiceRepository } from '../infrastructure/service.repository';
import { getServicesUseCase } from '../application/get-services.use-case';
import { getServiceByIdUseCase } from '../application/get-service-by-id.use-case';
import { createServiceUseCase } from '../application/create-service.use-case';
import { updateServiceUseCase } from '../application/update-service.use-case';
import { toggleServiceActiveUseCase } from '../application/toggle-service-active.use-case';
import { createServiceSchema, updateServiceSchema } from './service.dto';

const repository = new ServiceRepository();

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await getServicesUseCase(repository);
    res.json({ status: 'success', data: services });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await getServiceByIdUseCase(repository, req.params.id);
    res.json({ status: 'success', data: service });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createServiceSchema.parse(req.body);
    const service = await createServiceUseCase(repository, validated);
    res.status(201).json({ status: 'success', data: service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = updateServiceSchema.parse(req.body);
    const service = await updateServiceUseCase(repository, req.params.id, validated);
    res.json({ status: 'success', data: service });
  } catch (error) {
    next(error);
  }
};

export const toggleServiceActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await toggleServiceActiveUseCase(repository, req.params.id);
    res.json({ status: 'success', data: service });
  } catch (error) {
    next(error);
  }
};

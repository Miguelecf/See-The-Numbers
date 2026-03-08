import { ServiceRepository } from '../infrastructure/service.repository';
import { Service, ServiceWithCalculations } from '../domain/service.entity';
import { enrichServiceWithCalculations } from '../domain/service.calculations';
import { BadRequestError } from '../../../shared/errors/app-error';

export const updateServiceUseCase = async (
  repository: ServiceRepository,
  id: string,
  data: Partial<Service>
): Promise<ServiceWithCalculations> => {
  // Validación de negocio: precio de venta debe ser mayor a 0
  if (data.salePrice !== undefined && data.salePrice <= 0) {
    throw new BadRequestError('Sale price must be greater than 0');
  }

  // Validación de negocio: duración debe ser mayor a 0
  if (data.estimatedDurationMinutes !== undefined && data.estimatedDurationMinutes <= 0) {
    throw new BadRequestError('Estimated duration must be greater than 0');
  }

  const service = await repository.update(id, data);
  return enrichServiceWithCalculations(service);
};

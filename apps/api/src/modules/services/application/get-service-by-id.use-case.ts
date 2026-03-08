import { ServiceRepository } from '../infrastructure/service.repository';
import { ServiceWithCalculations } from '../domain/service.entity';
import { enrichServiceWithCalculations } from '../domain/service.calculations';

export const getServiceByIdUseCase = async (
  repository: ServiceRepository,
  id: string
): Promise<ServiceWithCalculations> => {
  const service = await repository.findById(id);
  return enrichServiceWithCalculations(service);
};

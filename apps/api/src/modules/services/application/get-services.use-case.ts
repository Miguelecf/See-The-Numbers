import { ServiceRepository } from '../infrastructure/service.repository';
import { ServiceWithCalculations } from '../domain/service.entity';
import { enrichServiceWithCalculations } from '../domain/service.calculations';

export const getServicesUseCase = async (
  repository: ServiceRepository
): Promise<ServiceWithCalculations[]> => {
  const services = await repository.findAll();
  return services.map(enrichServiceWithCalculations);
};

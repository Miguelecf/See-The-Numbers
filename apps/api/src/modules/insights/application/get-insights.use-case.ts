import { ServiceRepository } from '../../services/infrastructure/service.repository';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { SaleRepository } from '../../sales/infrastructure/sale.repository';
import { enrichServiceWithCalculations } from '../../services/domain/service.calculations';
import { enrichProductWithCalculations } from '../../products/domain/product.calculations';
import {
  generateServiceInsights,
  generateProductInsights,
  generateSalesInsights,
  Insight,
} from '../domain/insight.rules';

export const getInsightsUseCase = async (
  serviceRepository: ServiceRepository,
  productRepository: ProductRepository,
  saleRepository: SaleRepository
): Promise<Insight[]> => {
  const [services, products, sales] = await Promise.all([
    serviceRepository.findAll(),
    productRepository.findAll(),
    saleRepository.findAll(500),
  ]);

  const servicesWithCalcs = services.map(enrichServiceWithCalculations);
  const productsWithCalcs = products.map(enrichProductWithCalculations);

  const serviceInsights = generateServiceInsights(servicesWithCalcs);
  const productInsights = generateProductInsights(productsWithCalcs);
  const salesInsights = generateSalesInsights(sales, productsWithCalcs);

  // Combinar y ordenar por severidad: critical > warning > info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  return [...serviceInsights, ...productInsights, ...salesInsights].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
};

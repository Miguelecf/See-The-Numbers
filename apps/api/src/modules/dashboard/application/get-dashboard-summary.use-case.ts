import { ServiceRepository } from '../../services/infrastructure/service.repository';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { SaleRepository } from '../../sales/infrastructure/sale.repository';
import { enrichServiceWithCalculations } from '../../services/domain/service.calculations';
import { enrichProductWithCalculations } from '../../products/domain/product.calculations';

export interface DashboardSummary {
  services: {
    total: number;
    active: number;
    averageMargin: number;
    highestMargin: {
      name: string;
      margin: number;
    } | null;
  };
  products: {
    total: number;
    active: number;
    averageMargin: number;
    highestMargin: {
      name: string;
      margin: number;
    } | null;
  };
  alerts: {
    lowStockProducts: Array<{
      id: string;
      name: string;
      quantity: number;
      stockMinimum: number;
    }>;
    lowMarginServices: Array<{
      id: string;
      name: string;
      margin: number;
    }>;
  };
  sales: {
    todayTotal: number;
    weekTotal: number;
    count: number;
  };
}

export const getDashboardSummaryUseCase = async (
  serviceRepository: ServiceRepository,
  productRepository: ProductRepository,
  saleRepository: SaleRepository
): Promise<DashboardSummary> => {
  const [services, products, sales] = await Promise.all([
    serviceRepository.findAll(),
    productRepository.findAll(),
    saleRepository.findAll(500),
  ]);

  const servicesWithCalcs = services.map(enrichServiceWithCalculations);
  const productsWithCalcs = products.map(enrichProductWithCalculations);

  const activeServices = servicesWithCalcs.filter((s) => s.isActive);
  const activeProducts = productsWithCalcs.filter((p) => p.isActive);

  // Métricas de servicios
  const averageServiceMargin =
    activeServices.length > 0
      ? activeServices.reduce((sum, s) => sum + s.marginPercent, 0) / activeServices.length
      : 0;

  const serviceWithHighestMargin =
    activeServices.length > 0
      ? activeServices.reduce((max, s) => (s.marginPercent > max.marginPercent ? s : max))
      : null;

  // Métricas de productos
  const averageProductMargin =
    activeProducts.length > 0
      ? activeProducts.reduce((sum, p) => sum + p.marginPercent, 0) / activeProducts.length
      : 0;

  const productWithHighestMargin =
    activeProducts.length > 0
      ? activeProducts.reduce((max, p) => (p.marginPercent > max.marginPercent ? p : max))
      : null;

  // Alertas: productos con stock bajo
  const lowStockProducts = activeProducts
    .filter((p) => p.isLowStock)
    .map((p) => ({
      id: p._id!,
      name: p.name,
      quantity: p.quantity,
      stockMinimum: p.stockMinimum || 0,
    }));

  // Alertas: servicios con margen bajo (< 40%)
  const lowMarginServices = activeServices
    .filter((s) => s.marginPercent < 40)
    .map((s) => ({
      id: s._id!,
      name: s.name,
      margin: s.marginPercent,
    }));

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const todayTotal = sales
    .filter((sale) => (sale.createdAt ? sale.createdAt >= startOfDay : false))
    .reduce((sum, sale) => sum + sale.total, 0);

  const weekTotal = sales
    .filter((sale) => (sale.createdAt ? sale.createdAt >= startOfWeek : false))
    .reduce((sum, sale) => sum + sale.total, 0);

  return {
    services: {
      total: services.length,
      active: activeServices.length,
      averageMargin: averageServiceMargin,
      highestMargin: serviceWithHighestMargin
        ? {
            name: serviceWithHighestMargin.name,
            margin: serviceWithHighestMargin.marginPercent,
          }
        : null,
    },
    products: {
      total: products.length,
      active: activeProducts.length,
      averageMargin: averageProductMargin,
      highestMargin: productWithHighestMargin
        ? {
            name: productWithHighestMargin.name,
            margin: productWithHighestMargin.marginPercent,
          }
        : null,
    },
    alerts: {
      lowStockProducts,
      lowMarginServices,
    },
    sales: {
      todayTotal,
      weekTotal,
      count: sales.length,
    },
  };
};

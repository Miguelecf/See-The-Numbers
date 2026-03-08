import { Service, ServiceWithCalculations } from './service.entity';

/**
 * Calcula el costo total de un servicio
 * Formula: suma de cost items + labor cost
 */
export const calculateServiceTotalCost = (service: Service): number => {
  const costItemsTotal = service.costItems.reduce((sum, item) => sum + item.amount, 0);
  return costItemsTotal + service.laborCost;
};

/**
 * Calcula la ganancia de un servicio
 * Formula: precio de venta - costo total
 */
export const calculateServiceProfit = (service: Service, totalCost: number): number => {
  return service.salePrice - totalCost;
};

/**
 * Calcula el margen de ganancia de un servicio
 * Formula: (ganancia / precio de venta) * 100
 */
export const calculateServiceMarginPercent = (profit: number, salePrice: number): number => {
  if (salePrice <= 0) return 0;
  return (profit / salePrice) * 100;
};

/**
 * Agrega todos los cálculos derivados a un servicio
 */
export const enrichServiceWithCalculations = (service: Service): ServiceWithCalculations => {
  const costTotal = calculateServiceTotalCost(service);
  const profit = calculateServiceProfit(service, costTotal);
  const marginPercent = calculateServiceMarginPercent(profit, service.salePrice);

  return {
    ...service,
    costTotal,
    profit,
    marginPercent,
  };
};

import { Product, ProductWithCalculations } from './product.entity';

/**
 * Calcula la ganancia de un producto
 * Formula: precio de venta - precio de compra
 */
export const calculateProductProfit = (product: Product): number => {
  return product.price - product.cost;
};

/**
 * Calcula el margen de ganancia de un producto
 * Formula: (ganancia / precio de venta) * 100
 */
export const calculateProductMarginPercent = (profit: number, price: number): number => {
  if (price <= 0) return 0;
  return (profit / price) * 100;
};

/**
 * Determina si un producto tiene stock bajo
 */
export const isProductLowStock = (product: Product): boolean => {
  if (product.stockMinimum === undefined || product.stockMinimum === null) {
    return false;
  }
  return product.quantity <= product.stockMinimum;
};

/**
 * Agrega todos los cálculos derivados a un producto
 */
export const enrichProductWithCalculations = (product: Product): ProductWithCalculations => {
  const profit = calculateProductProfit(product);
  const marginPercent = calculateProductMarginPercent(profit, product.price);
  const isLowStock = isProductLowStock(product);

  return {
    ...product,
    profit,
    marginPercent,
    isLowStock,
  };
};

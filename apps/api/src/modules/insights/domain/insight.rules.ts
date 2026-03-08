import { ServiceWithCalculations } from '../../services/domain/service.entity';
import { ProductWithCalculations } from '../../products/domain/product.entity';
import { Sale } from '../../sales/domain/sale.entity';

export type InsightType =
  | 'low_service_margin'
  | 'low_product_margin'
  | 'low_stock'
  | 'top_service_performer'
  | 'top_product_performer'
  | 'service_average_below_target'
  | 'product_average_below_target'
  | 'negative_service_margin'
  | 'negative_product_margin'
  | 'top_selling_product'
  | 'product_without_recent_sales'
  | 'daily_sales_total'
  | 'weekly_sales_total'
  | 'sales_by_payment_method';

export type InsightSeverity = 'info' | 'warning' | 'critical';

export interface Insight {
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  entityId?: string;
  entityName?: string;
  value?: number;
}

const SERVICE_LOW_MARGIN_THRESHOLD = 40;
const PRODUCT_LOW_MARGIN_THRESHOLD = 25;
const SERVICE_TARGET_MARGIN = 40;
const PRODUCT_TARGET_MARGIN = 25;

/**
 * Reglas determinísticas de negocio para generar insights
 */

export const generateServiceInsights = (
  services: ServiceWithCalculations[]
): Insight[] => {
  const insights: Insight[] = [];
  const activeServices = services.filter((s) => s.isActive);

  if (activeServices.length === 0) return insights;

  // Promedio de margen de servicios
  const avgMargin =
    activeServices.reduce((sum, s) => sum + s.marginPercent, 0) / activeServices.length;

  if (avgMargin < SERVICE_TARGET_MARGIN) {
    insights.push({
      type: 'service_average_below_target',
      severity: 'warning',
      title: 'Margen promedio de servicios bajo',
      description: `El margen promedio de servicios (${avgMargin.toFixed(1)}%) está por debajo del objetivo (${SERVICE_TARGET_MARGIN}%)`,
      value: avgMargin,
    });
  }

  // Mejor servicio
  const topService = activeServices.reduce((max, s) =>
    s.marginPercent > max.marginPercent ? s : max
  );

  insights.push({
    type: 'top_service_performer',
    severity: 'info',
    title: 'Servicio más rentable',
    description: `"${topService.name}" tiene el mejor margen (${topService.marginPercent.toFixed(1)}%)`,
    entityId: topService._id,
    entityName: topService.name,
    value: topService.marginPercent,
  });

  // Servicios con margen bajo
  activeServices
    .filter((s) => s.marginPercent < SERVICE_LOW_MARGIN_THRESHOLD && s.marginPercent >= 0)
    .forEach((service) => {
      insights.push({
        type: 'low_service_margin',
        severity: 'warning',
        title: 'Servicio con margen bajo',
        description: `"${service.name}" tiene un margen de ${service.marginPercent.toFixed(1)}% (recomendado: ${SERVICE_LOW_MARGIN_THRESHOLD}%+)`,
        entityId: service._id,
        entityName: service.name,
        value: service.marginPercent,
      });
    });

  // Servicios con margen negativo
  activeServices
    .filter((s) => s.marginPercent < 0)
    .forEach((service) => {
      insights.push({
        type: 'negative_service_margin',
        severity: 'critical',
        title: 'Servicio con pérdida',
        description: `"${service.name}" está generando pérdidas (margen: ${service.marginPercent.toFixed(1)}%)`,
        entityId: service._id,
        entityName: service.name,
        value: service.marginPercent,
      });
    });

  return insights;
};

export const generateProductInsights = (
  products: ProductWithCalculations[]
): Insight[] => {
  const insights: Insight[] = [];
  const activeProducts = products.filter((p) => p.isActive);

  if (activeProducts.length === 0) return insights;

  // Promedio de margen de productos
  const avgMargin =
    activeProducts.reduce((sum, p) => sum + p.marginPercent, 0) / activeProducts.length;

  if (avgMargin < PRODUCT_TARGET_MARGIN) {
    insights.push({
      type: 'product_average_below_target',
      severity: 'warning',
      title: 'Margen promedio de productos bajo',
      description: `El margen promedio de productos (${avgMargin.toFixed(1)}%) está por debajo del objetivo (${PRODUCT_TARGET_MARGIN}%)`,
      value: avgMargin,
    });
  }

  // Mejor producto
  const topProduct = activeProducts.reduce((max, p) =>
    p.marginPercent > max.marginPercent ? p : max
  );

  insights.push({
    type: 'top_product_performer',
    severity: 'info',
    title: 'Producto más rentable',
    description: `"${topProduct.name}" tiene el mejor margen (${topProduct.marginPercent.toFixed(1)}%)`,
    entityId: topProduct._id,
    entityName: topProduct.name,
    value: topProduct.marginPercent,
  });

  // Productos con margen bajo
  activeProducts
    .filter((p) => p.marginPercent < PRODUCT_LOW_MARGIN_THRESHOLD && p.marginPercent >= 0)
    .forEach((product) => {
      insights.push({
        type: 'low_product_margin',
        severity: 'warning',
        title: 'Producto con margen bajo',
        description: `"${product.name}" tiene un margen de ${product.marginPercent.toFixed(1)}% (recomendado: ${PRODUCT_LOW_MARGIN_THRESHOLD}%+)`,
        entityId: product._id,
        entityName: product.name,
        value: product.marginPercent,
      });
    });

  // Productos con margen negativo
  activeProducts
    .filter((p) => p.marginPercent < 0)
    .forEach((product) => {
      insights.push({
        type: 'negative_product_margin',
        severity: 'critical',
        title: 'Producto con pérdida',
        description: `"${product.name}" está generando pérdidas (margen: ${product.marginPercent.toFixed(1)}%)`,
        entityId: product._id,
        entityName: product.name,
        value: product.marginPercent,
      });
    });

  // Productos con stock bajo
  activeProducts
    .filter((p) => p.isLowStock)
    .forEach((product) => {
      insights.push({
        type: 'low_stock',
        severity: 'warning',
        title: 'Stock bajo',
        description: `"${product.name}" tiene stock bajo (actual: ${product.quantity}, mínimo: ${product.stockMinimum || 0})`,
        entityId: product._id,
        entityName: product.name,
        value: product.quantity,
      });
    });

  return insights;
};

export const generateSalesInsights = (
  sales: Sale[],
  products: ProductWithCalculations[]
): Insight[] => {
  const insights: Insight[] = [];

  if (sales.length === 0) {
    insights.push({
      type: 'daily_sales_total',
      severity: 'warning',
      title: 'Sin ventas registradas',
      description: 'No hay ventas confirmadas todavía. Registra tu primera venta desde POS.',
      value: 0,
    });
    return insights;
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfRecentWindow = new Date(startOfDay);
  startOfRecentWindow.setDate(startOfRecentWindow.getDate() - 30);

  const dailyTotal = sales
    .filter((sale) => (sale.createdAt ? sale.createdAt >= startOfDay : false))
    .reduce((sum, sale) => sum + sale.total, 0);

  const weeklyTotal = sales
    .filter((sale) => (sale.createdAt ? sale.createdAt >= startOfWeek : false))
    .reduce((sum, sale) => sum + sale.total, 0);

  insights.push({
    type: 'daily_sales_total',
    severity: dailyTotal > 0 ? 'info' : 'warning',
    title: 'Ventas del día',
    description: `Total vendido hoy: ${dailyTotal.toFixed(2)}`,
    value: dailyTotal,
  });

  insights.push({
    type: 'weekly_sales_total',
    severity: 'info',
    title: 'Ventas de los últimos 7 días',
    description: `Total vendido esta semana: ${weeklyTotal.toFixed(2)}`,
    value: weeklyTotal,
  });

  const soldQtyByProduct = new Map<string, number>();
  for (const sale of sales) {
    for (const item of sale.items) {
      if (item.type !== 'PRODUCT') continue;
      soldQtyByProduct.set(item.referenceId, (soldQtyByProduct.get(item.referenceId) ?? 0) + item.quantity);
    }
  }

  let topProductId: string | null = null;
  let topProductQty = 0;
  for (const [productId, qty] of soldQtyByProduct.entries()) {
    if (qty > topProductQty) {
      topProductQty = qty;
      topProductId = productId;
    }
  }

  if (topProductId) {
    const topProduct = products.find((product) => product._id === topProductId);
    insights.push({
      type: 'top_selling_product',
      severity: 'info',
      title: 'Producto más vendido',
      description: topProduct
        ? `"${topProduct.name}" lidera con ${topProductQty} unidades vendidas.`
        : `Producto ${topProductId} lidera con ${topProductQty} unidades vendidas.`,
      entityId: topProductId,
      entityName: topProduct?.name,
      value: topProductQty,
    });
  }

  const soldRecentlyProductIds = new Set<string>();
  for (const sale of sales) {
    if (!sale.createdAt || sale.createdAt < startOfRecentWindow) continue;

    for (const item of sale.items) {
      if (item.type === 'PRODUCT') {
        soldRecentlyProductIds.add(item.referenceId);
      }
    }
  }

  products
    .filter((product) => product.isActive && !soldRecentlyProductIds.has(product._id!))
    .slice(0, 5)
    .forEach((product) => {
      insights.push({
        type: 'product_without_recent_sales',
        severity: 'warning',
        title: 'Producto sin ventas recientes',
        description: `"${product.name}" no registra ventas en los últimos 30 días.`,
        entityId: product._id,
        entityName: product.name,
      });
    });

  const salesByPaymentMethod = new Map<string, number>();
  for (const sale of sales) {
    salesByPaymentMethod.set(
      sale.paymentMethodNameSnapshot,
      (salesByPaymentMethod.get(sale.paymentMethodNameSnapshot) ?? 0) + sale.total
    );
  }

  const topPaymentMethod = [...salesByPaymentMethod.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topPaymentMethod) {
    insights.push({
      type: 'sales_by_payment_method',
      severity: 'info',
      title: 'Método de pago principal',
      description: `${topPaymentMethod[0]} concentra ${topPaymentMethod[1].toFixed(2)} en ventas.`,
      value: topPaymentMethod[1],
    });
  }

  return insights;
};

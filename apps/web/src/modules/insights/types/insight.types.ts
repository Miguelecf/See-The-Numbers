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

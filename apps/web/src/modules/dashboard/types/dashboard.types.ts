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

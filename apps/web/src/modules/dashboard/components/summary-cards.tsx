import { DashboardSummary } from '../types/dashboard.types';
import { MetricCard } from '@/shared/components/metric-card';
import { BarChart3, TrendingUp, Package, Scissors, Wallet, CalendarDays } from 'lucide-react';
import { formatPercent } from '@/shared/utils/format-percent';
import { formatCurrency } from '@/shared/utils/format-currency';

interface SummaryCardsProps {
  data: DashboardSummary;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Servicios activos"
        value={data.services.active}
        icon={Scissors}
        description={`de ${data.services.total} totales`}
      />
      <MetricCard
        title="Productos activos"
        value={data.products.active}
        icon={Package}
        description={`de ${data.products.total} totales`}
      />
      <MetricCard
        title="Margen prom. servicios"
        value={formatPercent(data.services.averageMargin)}
        icon={BarChart3}
        description={data.services.highestMargin ? `Mejor: ${data.services.highestMargin.name}` : undefined}
      />
      <MetricCard
        title="Margen prom. productos"
        value={formatPercent(data.products.averageMargin)}
        icon={TrendingUp}
        description={data.products.highestMargin ? `Mejor: ${data.products.highestMargin.name}` : undefined}
      />
      <MetricCard
        title="Ventas hoy"
        value={formatCurrency(data.sales.todayTotal)}
        icon={Wallet}
        description={`${data.sales.count} ventas registradas`}
      />
      <MetricCard
        title="Ventas 7 días"
        value={formatCurrency(data.sales.weekTotal)}
        icon={CalendarDays}
      />
    </div>
  );
}

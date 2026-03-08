'use client';

import { useDashboard } from '@/modules/dashboard/hooks/use-dashboard';
import { LoadingState } from '@/shared/components/loading-state';
import { SummaryCards } from '@/modules/dashboard/components/summary-cards';
import { AlertsSection } from '@/modules/dashboard/components/alerts-section';
import { PageHeader } from '@/shared/components/layout/page-header';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error al cargar el dashboard</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <PageHeader heading="Dashboard" text="Visualiza las métricas clave de tu negocio" />
      <SummaryCards data={data} />
      <AlertsSection data={data} />
    </div>
  );
}

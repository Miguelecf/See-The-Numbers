'use client';

import { useInsights } from '@/modules/insights/hooks/use-insights';
import { InsightsList } from '@/modules/insights/components/insights-list';
import { LoadingState } from '@/shared/components/loading-state';
import { PageHeader } from '@/shared/components/layout/page-header';

export default function InsightsPage() {
  const { data: insights, isLoading, error } = useInsights();

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error al cargar insights</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Insights"
        text="Recomendaciones y alertas sobre tu negocio basadas en métricas clave"
      />
      {insights && <InsightsList insights={insights} />}
    </div>
  );
}

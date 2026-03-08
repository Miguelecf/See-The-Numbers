import Link from 'next/link';
import { Insight, InsightSeverity } from '../types/insight.types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface InsightsListProps {
  insights: Insight[];
}

const severityConfig: Record<InsightSeverity, { icon: any; className: string }> = {
  critical: {
    icon: AlertCircle,
    className: 'text-destructive bg-destructive/10 border-destructive/20',
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-warning bg-warning/10 border-warning/20',
  },
  info: {
    icon: Info,
    className: 'text-primary bg-primary/10 border-primary/20',
  },
};

export function InsightsList({ insights }: InsightsListProps) {
  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay insights en este momento</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const config = severityConfig[insight.severity];
        const Icon = config.icon;

        const isLinked = insight.entityId &&
          (insight.type.includes('service') || insight.type.includes('product') || insight.type === 'low_stock');

        const href = isLinked
          ? insight.type.includes('service')
            ? `/services/${insight.entityId}`
            : `/products/${insight.entityId}`
          : undefined;

        const content = (
          <Card className={`border ${config.className} transition-colors ${href ? 'hover:shadow-md cursor-pointer' : ''}`}>
            <CardContent className="flex items-start gap-4 p-4">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </CardContent>
          </Card>
        );

        return href ? (
          <Link key={index} href={href}>
            {content}
          </Link>
        ) : (
          <div key={index}>{content}</div>
        );
      })}
    </div>
  );
}

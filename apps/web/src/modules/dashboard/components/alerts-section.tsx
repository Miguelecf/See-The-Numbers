import Link from 'next/link';
import { DashboardSummary } from '../types/dashboard.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertTriangle, PackageX } from 'lucide-react';
import { formatPercent } from '@/shared/utils/format-percent';

interface AlertsSectionProps {
  data: DashboardSummary;
}

export function AlertsSection({ data }: AlertsSectionProps) {
  const hasLowStockProducts = data.alerts.lowStockProducts.length > 0;
  const hasLowMarginServices = data.alerts.lowMarginServices.length > 0;

  if (!hasLowStockProducts && !hasLowMarginServices) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {hasLowStockProducts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PackageX className="h-5 w-5 text-warning" />
              Stock bajo
            </CardTitle>
            <CardDescription>Productos que requieren reposición</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.alerts.lowStockProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">
                  {product.quantity} / {product.stockMinimum}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {hasLowMarginServices && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Margen bajo
            </CardTitle>
            <CardDescription>Servicios con margen menor a 40%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.alerts.lowMarginServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium">{service.name}</span>
                <span className="text-sm text-muted-foreground">{formatPercent(service.margin)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

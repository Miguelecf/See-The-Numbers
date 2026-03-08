'use client';

import Link from 'next/link';
import { useService, useToggleServiceActive } from '@/modules/services/hooks/use-services';
import { LoadingState } from '@/shared/components/loading-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/layout/page-header';
import { MarginBadge } from '@/shared/components/margin-badge';
import { StatusBadge } from '@/shared/components/status-badge';
import { formatCurrency } from '@/shared/utils/format-currency';
import { Edit, Power } from 'lucide-react';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const { data: service, isLoading } = useService(params.id);
  const { mutate: toggleActive } = useToggleServiceActive();

  if (isLoading) return <LoadingState />;
  if (!service) return <div>Servicio no encontrado</div>;

  return (
    <div className="space-y-6">
      <PageHeader heading={service.name}>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toggleActive(params.id)}
          >
            <Power className="mr-2 h-4 w-4" />
            {service.isActive ? 'Desactivar' : 'Activar'}
          </Button>
          <Button asChild>
            <Link href={`/services/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información general</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categoría:</span>
              <span className="font-medium">{service.category || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio de venta:</span>
              <span className="font-medium">{formatCurrency(service.salePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duración:</span>
              <span className="font-medium">{service.estimatedDurationMinutes} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <StatusBadge isActive={service.isActive} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas financieras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Costo total:</span>
              <span className="font-medium">{formatCurrency(service.costTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mano de obra:</span>
              <span className="font-medium">{formatCurrency(service.laborCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ganancia:</span>
              <span className="font-medium">{formatCurrency(service.profit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Margen:</span>
              <MarginBadge margin={service.marginPercent} type="service" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items de costo</CardTitle>
        </CardHeader>
        <CardContent>
          {service.costItems.length > 0 ? (
            <div className="space-y-2">
              {service.costItems.map((item, index) => (
                <div key={item._id || index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.category && <p className="text-sm text-muted-foreground">{item.category}</p>}
                  </div>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay items de costo</p>
          )}
        </CardContent>
      </Card>

      {service.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{service.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

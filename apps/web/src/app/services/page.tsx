'use client';

import Link from 'next/link';
import { useServices } from '@/modules/services/hooks/use-services';
import { ServiceTable } from '@/modules/services/components/service-table';
import { LoadingState } from '@/shared/components/loading-state';
import { EmptyState } from '@/shared/components/empty-state';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export default function ServicesPage() {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error al cargar servicios</div>;

  return (
    <div className="space-y-6">
      <PageHeader heading="Servicios" text="Gestiona los servicios de tu negocio">
        <Button asChild>
          <Link href="/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo servicio
          </Link>
        </Button>
      </PageHeader>

      {services && services.length > 0 ? (
        <ServiceTable services={services} />
      ) : (
        <EmptyState
          title="No hay servicios"
          description="Comienza creando tu primer servicio"
          action={
            <Button asChild>
              <Link href="/services/new">
                <Plus className="mr-2 h-4 w-4" />
                Crear servicio
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}

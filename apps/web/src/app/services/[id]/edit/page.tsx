'use client';

import { useRouter } from 'next/navigation';
import { useService, useUpdateService } from '@/modules/services/hooks/use-services';
import { ServiceForm } from '@/modules/services/components/service-form';
import { ServiceFormData } from '@/modules/services/schemas/service.schema';
import { LoadingState } from '@/shared/components/loading-state';
import { PageHeader } from '@/shared/components/layout/page-header';

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: service, isLoading } = useService(params.id);
  const { mutate: updateService, isPending } = useUpdateService();

  if (isLoading) return <LoadingState />;
  if (!service) return <div>Servicio no encontrado</div>;

  const handleSubmit = (data: ServiceFormData) => {
    updateService(
      { id: params.id, data },
      {
        onSuccess: () => {
          router.push(`/services/${params.id}`);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader heading="Editar servicio" text={`Editando: ${service.name}`} />
      <ServiceForm defaultValues={service} onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

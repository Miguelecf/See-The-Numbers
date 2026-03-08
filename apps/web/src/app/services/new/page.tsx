'use client';

import { useRouter } from 'next/navigation';
import { useCreateService } from '@/modules/services/hooks/use-services';
import { ServiceForm } from '@/modules/services/components/service-form';
import { ServiceFormData } from '@/modules/services/schemas/service.schema';
import { PageHeader } from '@/shared/components/layout/page-header';

export default function NewServicePage() {
  const router = useRouter();
  const { mutate: createService, isPending } = useCreateService();

  const handleSubmit = (data: ServiceFormData) => {
    createService(data, {
      onSuccess: () => {
        router.push('/services');
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader heading="Nuevo servicio" text="Crea un nuevo servicio para tu negocio" />
      <ServiceForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

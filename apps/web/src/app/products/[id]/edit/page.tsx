'use client';

import { useRouter } from 'next/navigation';
import { useProduct, useUpdateProduct } from '@/modules/products/hooks/use-products';
import { ProductForm } from '@/modules/products/components/product-form';
import { ProductFormData } from '@/modules/products/schemas/product.schema';
import { LoadingState } from '@/shared/components/loading-state';
import { PageHeader } from '@/shared/components/layout/page-header';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: product, isLoading } = useProduct(params.id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  if (isLoading) return <LoadingState />;
  if (!product) return <div>Producto no encontrado</div>;

  const handleSubmit = (data: ProductFormData) => {
    updateProduct(
      { id: params.id, data },
      {
        onSuccess: () => {
          router.push(`/products/${params.id}`);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader heading="Editar producto" text={`Editando: ${product.name}`} />
      <ProductForm defaultValues={product} onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useCreateProduct } from '@/modules/products/hooks/use-products';
import { ProductForm } from '@/modules/products/components/product-form';
import { ProductFormData } from '@/modules/products/schemas/product.schema';
import { PageHeader } from '@/shared/components/layout/page-header';

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (data: ProductFormData) => {
    createProduct(data, {
      onSuccess: () => {
        router.push('/products');
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader heading="Nuevo producto" text="Crea un nuevo producto para tu negocio" />
      <ProductForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

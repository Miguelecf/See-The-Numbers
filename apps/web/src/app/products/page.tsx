'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useProducts } from '@/modules/products/hooks/use-products';
import { ProductTable } from '@/modules/products/components/product-table';
import { ProductImportPanel } from '@/modules/products/components/product-import-panel';
import { LoadingState } from '@/shared/components/loading-state';
import { EmptyState } from '@/shared/components/empty-state';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [laboratory, setLaboratory] = useState('');

  const { data: products, isLoading, error } = useProducts({
    search: search || undefined,
    category: category || undefined,
    supplier: supplier || undefined,
    laboratory: laboratory || undefined,
  });

  const categoryOptions = useMemo(
    () => Array.from(new Set((products || []).map((product) => product.category).filter(Boolean))),
    [products]
  );

  const supplierOptions = useMemo(
    () => Array.from(new Set((products || []).map((product) => product.supplier).filter(Boolean))),
    [products]
  );

  const laboratoryOptions = useMemo(
    () => Array.from(new Set((products || []).map((product) => product.laboratory).filter(Boolean))),
    [products]
  );

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error al cargar productos</div>;

  return (
    <div className="space-y-6">
      <PageHeader heading="Productos" text="Gestiona los productos de tu negocio">
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Link>
        </Button>
      </PageHeader>

      {products && products.length > 0 ? (
        <>
          <ProductImportPanel />
          <div className="grid gap-4 rounded-md border p-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="SKU, nombre o barcode"
              />
            </div>
            <div>
              <Label htmlFor="category-filter">Categoría</Label>
              <select
                id="category-filter"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Todas</option>
                {categoryOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="supplier-filter">Proveedor</Label>
              <select
                id="supplier-filter"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={supplier}
                onChange={(event) => setSupplier(event.target.value)}
              >
                <option value="">Todos</option>
                {supplierOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="laboratory-filter">Laboratorio</Label>
              <select
                id="laboratory-filter"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={laboratory}
                onChange={(event) => setLaboratory(event.target.value)}
              >
                <option value="">Todos</option>
                {laboratoryOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ProductTable products={products} />
        </>
      ) : (
        <>
          <ProductImportPanel />
          <EmptyState
            title="No hay productos"
            description="Comienza creando tu primer producto"
            action={
              <Button asChild>
                <Link href="/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear producto
                </Link>
              </Button>
            }
          />
        </>
      )}
    </div>
  );
}

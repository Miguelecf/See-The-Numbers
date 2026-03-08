'use client';

import Link from 'next/link';
import { useProduct, useToggleProductActive } from '@/modules/products/hooks/use-products';
import { LoadingState } from '@/shared/components/loading-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/layout/page-header';
import { MarginBadge } from '@/shared/components/margin-badge';
import { StatusBadge } from '@/shared/components/status-badge';
import { formatCurrency } from '@/shared/utils/format-currency';
import { Edit, Power, AlertTriangle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading } = useProduct(params.id);
  const { mutate: toggleActive } = useToggleProductActive();

  if (isLoading) return <LoadingState />;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="space-y-6">
      <PageHeader heading={product.name}>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toggleActive(params.id)}
          >
            <Power className="mr-2 h-4 w-4" />
            {product.isActive ? 'Desactivar' : 'Activar'}
          </Button>
          <Button asChild>
            <Link href={`/products/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </PageHeader>

      {product.isLowStock && (
        <div className="flex items-center gap-2 rounded-lg border border-warning bg-warning/10 p-4">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <p className="text-sm font-medium">
            Stock bajo: {product.quantity} unidades (mínimo: {product.stockMinimum})
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información general</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU:</span>
              <span className="font-medium font-mono">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Proveedor:</span>
              <span className="font-medium">{product.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Laboratorio:</span>
              <span className="font-medium">{product.laboratory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unidad:</span>
              <span className="font-medium">{product.unitOfMeasure}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categoría:</span>
              <span className="font-medium">{product.category || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Costo:</span>
              <span className="font-medium">{formatCurrency(product.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio:</span>
              <span className="font-medium">{formatCurrency(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <StatusBadge isActive={product.isActive} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas financieras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ganancia unitaria:</span>
              <span className="font-medium">{formatCurrency(product.profit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Margen:</span>
              <MarginBadge margin={product.marginPercent} type="product" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cantidad:</span>
              <span className="font-medium">{product.quantity} unidades</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock mínimo:</span>
              <span className="font-medium">{product.stockMinimum || '-'} unidades</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {product.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{product.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

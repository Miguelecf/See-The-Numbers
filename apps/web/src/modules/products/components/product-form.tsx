'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '../schemas/product.schema';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      quantity: 0,
      unitOfMeasure: 'unit',
      isActive: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" {...register('barcode')} placeholder="Opcional" />
            </div>
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" {...register('sku')} />
              {errors.sku && <p className="mt-1 text-sm text-destructive">{errors.sku.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="supplier">Proveedor *</Label>
              <Input id="supplier" {...register('supplier')} />
              {errors.supplier && <p className="mt-1 text-sm text-destructive">{errors.supplier.message}</p>}
            </div>
            <div>
              <Label htmlFor="laboratory">Laboratorio *</Label>
              <Input id="laboratory" {...register('laboratory')} />
              {errors.laboratory && <p className="mt-1 text-sm text-destructive">{errors.laboratory.message}</p>}
            </div>
            <div>
              <Label htmlFor="unitOfMeasure">Unidad *</Label>
              <Input id="unitOfMeasure" {...register('unitOfMeasure')} placeholder="unit, kg, lt" />
              {errors.unitOfMeasure && (
                <p className="mt-1 text-sm text-destructive">{errors.unitOfMeasure.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="cost">Costo *</Label>
              <Input id="cost" type="number" step="0.01" {...register('cost')} />
              {errors.cost && <p className="mt-1 text-sm text-destructive">{errors.cost.message}</p>}
            </div>
            <div>
              <Label htmlFor="price">Precio *</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input id="quantity" type="number" {...register('quantity')} />
              {errors.quantity && <p className="mt-1 text-sm text-destructive">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" {...register('category')} />
            </div>
            <div>
              <Label htmlFor="stockMinimum">Stock mínimo</Label>
              <Input id="stockMinimum" type="number" {...register('stockMinimum')} />
              {errors.stockMinimum && (
                <p className="mt-1 text-sm text-destructive">{errors.stockMinimum.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" {...register('notes')} rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar producto'}
        </Button>
      </div>
    </form>
  );
}

'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, ServiceFormData } from '../schemas/service.schema';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  isLoading?: boolean;
}

export function ServiceForm({ defaultValues, onSubmit, isLoading }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultValues || {
      costItems: [],
      laborCost: 0,
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costItems',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del servicio *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <Input id="category" {...register('category')} placeholder="Ej: Baño, Corte, Estética" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salePrice">Precio de venta *</Label>
              <Input id="salePrice" type="number" step="0.01" {...register('salePrice')} />
              {errors.salePrice && <p className="text-sm text-destructive mt-1">{errors.salePrice.message}</p>}
            </div>

            <div>
              <Label htmlFor="estimatedDurationMinutes">Duración (minutos) *</Label>
              <Input id="estimatedDurationMinutes" type="number" {...register('estimatedDurationMinutes')} />
              {errors.estimatedDurationMinutes && <p className="text-sm text-destructive mt-1">{errors.estimatedDurationMinutes.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="laborCost">Costo de mano de obra</Label>
            <Input id="laborCost" type="number" step="0.01" {...register('laborCost')} />
            {errors.laborCost && <p className="text-sm text-destructive mt-1">{errors.laborCost.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" {...register('notes')} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items de costo</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', amount: 0 })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start border-b pb-4 last:border-0">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre *</Label>
                    <Input {...register(`costItems.${index}.name`)} />
                    {errors.costItems?.[index]?.name && (
                      <p className="text-sm text-destructive mt-1">{errors.costItems[index]?.name?.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Monto *</Label>
                    <Input type="number" step="0.01" {...register(`costItems.${index}.amount`)} />
                    {errors.costItems?.[index]?.amount && (
                      <p className="text-sm text-destructive mt-1">{errors.costItems[index]?.amount?.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Input {...register(`costItems.${index}.category`)} placeholder="Ej: Insumo, Energía" />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="mt-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay items de costo. Haz clic en "Agregar item" para comenzar.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar servicio'}
        </Button>
      </div>
    </form>
  );
}

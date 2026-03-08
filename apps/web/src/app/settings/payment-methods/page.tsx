'use client';

import { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import {
  useCreatePaymentMethod,
  usePaymentMethods,
  useTogglePaymentMethodActive,
} from '@/modules/payment-methods/hooks/use-payment-methods';

export default function PaymentMethodsPage() {
  const { data: methods = [] } = usePaymentMethods();
  const createMutation = useCreatePaymentMethod();
  const toggleMutation = useTogglePaymentMethodActive();
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;

    createMutation.mutate(
      {
        name: name.trim(),
      },
      {
        onSuccess: () => setName(''),
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Métodos de pago"
        text="Configura los métodos disponibles para cobrar ventas en POS"
      />

      <Card>
        <CardHeader>
          <CardTitle>Nuevo método</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: cash, debit, transfer"
          />
          <Button onClick={handleCreate} disabled={createMutation.isPending || !name.trim()}>
            Agregar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method._id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={toggleMutation.isPending}
                      onClick={() => toggleMutation.mutate(method._id)}
                    >
                      {method.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

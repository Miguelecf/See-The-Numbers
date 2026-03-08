'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { useProducts } from '@/modules/products/hooks/use-products';
import { useAdjustStock, useRechargeStock, useStockMovements } from '@/modules/inventory/hooks/use-inventory';

export default function InventoryPage() {
  const { data: products = [] } = useProducts();
  const [productId, setProductId] = useState('');
  const [rechargeQty, setRechargeQty] = useState(0);
  const [adjustQty, setAdjustQty] = useState(0);
  const [reason, setReason] = useState('Manual update');

  const selectedProduct = useMemo(
    () => products.find((product) => product._id === productId),
    [productId, products]
  );

  const { data: movements = [] } = useStockMovements(productId);
  const rechargeMutation = useRechargeStock();
  const adjustMutation = useAdjustStock();

  const handleRecharge = () => {
    if (!productId || rechargeQty <= 0) {
      return;
    }

    rechargeMutation.mutate({
      productId,
      quantity: rechargeQty,
      reason,
    });
  };

  const handleAdjust = () => {
    if (!productId || adjustQty < 0) {
      return;
    }

    adjustMutation.mutate({
      productId,
      quantity: adjustQty,
      reason,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Gestión de stock"
        text="Recarga, ajuste manual y seguimiento de movimientos por producto"
      />

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar producto</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="inventory-product">Producto</Label>
            <select
              id="inventory-product"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={productId}
              onChange={(event) => {
                setProductId(event.target.value);
                setAdjustQty(0);
                setRechargeQty(0);
              }}
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.sku} - {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="font-medium">Stock actual</p>
            <p className="text-muted-foreground">
              {selectedProduct ? `${selectedProduct.quantity} ${selectedProduct.unitOfMeasure}` : '-'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recargar stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="recharge-qty">Cantidad a ingresar</Label>
              <Input
                id="recharge-qty"
                type="number"
                min={0}
                value={rechargeQty}
                onChange={(event) => setRechargeQty(Number(event.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="inventory-reason">Motivo</Label>
              <Input
                id="inventory-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </div>
            <Button
              onClick={handleRecharge}
              disabled={rechargeMutation.isPending || !productId || rechargeQty <= 0}
            >
              {rechargeMutation.isPending ? 'Procesando...' : 'Registrar recarga'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ajuste manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="adjust-qty">Nuevo stock total</Label>
              <Input
                id="adjust-qty"
                type="number"
                min={0}
                value={adjustQty}
                onChange={(event) => setAdjustQty(Number(event.target.value))}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleAdjust}
              disabled={adjustMutation.isPending || !productId || adjustQty < 0}
            >
              {adjustMutation.isPending ? 'Procesando...' : 'Registrar ajuste'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement._id}>
                  <TableCell>{new Date(movement.createdAt).toLocaleString('es-AR')}</TableCell>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Sin movimientos para este producto.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Product } from '../types/product.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { MarginBadge } from '@/shared/components/margin-badge';
import { StatusBadge } from '@/shared/components/status-badge';
import { formatCurrency } from '@/shared/utils/format-currency';
import { Eye, Edit, AlertTriangle } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Laboratorio</TableHead>
            <TableHead className="text-right">Costo</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Margen</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{product.sku || '-'}</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {product.isLowStock && <AlertTriangle className="h-4 w-4 text-warning" />}
                  {product.name}
                </div>
              </TableCell>
              <TableCell>{product.category || '-'}</TableCell>
              <TableCell>{product.supplier}</TableCell>
              <TableCell>{product.laboratory}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.cost)}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
              <TableCell className="text-right">{product.quantity}</TableCell>
              <TableCell>
                <MarginBadge margin={product.marginPercent} type="product" />
              </TableCell>
              <TableCell>
                <StatusBadge isActive={product.isActive} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/products/${product._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/products/${product._id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

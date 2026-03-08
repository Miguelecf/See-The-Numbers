'use client';

import Link from 'next/link';
import { Service } from '../types/service.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { MarginBadge } from '@/shared/components/margin-badge';
import { StatusBadge } from '@/shared/components/status-badge';
import { formatCurrency } from '@/shared/utils/format-currency';
import { Eye, Edit } from 'lucide-react';

interface ServiceTableProps {
  services: Service[];
}

export function ServiceTable({ services }: ServiceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Costo</TableHead>
            <TableHead className="text-right">Ganancia</TableHead>
            <TableHead>Margen</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service._id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category || '-'}</TableCell>
              <TableCell className="text-right">{formatCurrency(service.salePrice)}</TableCell>
              <TableCell className="text-right">{formatCurrency(service.costTotal)}</TableCell>
              <TableCell className="text-right">{formatCurrency(service.profit)}</TableCell>
              <TableCell>
                <MarginBadge margin={service.marginPercent} type="service" />
              </TableCell>
              <TableCell>
                <StatusBadge isActive={service.isActive} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/services/${service._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/services/${service._id}/edit`}>
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

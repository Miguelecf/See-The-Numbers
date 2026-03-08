'use client';

import { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { useSales } from '@/modules/sales/hooks/use-sales';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { formatCurrency } from '@/shared/utils/format-currency';
import { LoadingState } from '@/shared/components/loading-state';

export default function SalesPage() {
  const [customerAliasSearch, setCustomerAliasSearch] = useState('');
  const { data: sales, isLoading } = useSales(customerAliasSearch || undefined);

  const downloadInvoice = (saleId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    // Obtener identidad del local para el PDF
    let storeName = 'SeeTheNumbers';
    try {
      const saved = localStorage.getItem('stn-branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeName) storeName = parsed.storeName;
      }
    } catch (e) {}

    window.open(`${apiUrl}/api/sales/${saleId}/invoice?storeName=${encodeURIComponent(storeName)}`, '_blank');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Historial de ventas"
        text="Consulta ventas confirmadas con detalle de ítems y método de pago"
      />

      <div className="apple-card overflow-hidden">
        <div className="p-6 border-b bg-secondary/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={customerAliasSearch}
              onChange={(event) => setCustomerAliasSearch(event.target.value)}
              placeholder="Buscar por cliente..."
              className="pl-10"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-center">Ítems</TableHead>
              <TableHead>Método de pago</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(sales || []).map((sale) => (
              <TableRow key={sale._id} className="hover:bg-secondary/10">
                <TableCell className="font-medium">
                  {new Date(sale.createdAt).toLocaleDateString('es-AR')}
                  <span className="block text-xs text-muted-foreground">
                    {new Date(sale.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </TableCell>
                <TableCell>{sale.customerAlias || <span className="text-muted-foreground italic text-xs">Consumidor Final</span>}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {sale.items.length}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {sale.paymentMethodNameSnapshot}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(sale.total)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-2 rounded-full"
                    onClick={() => downloadInvoice(sale._id)}
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">Factura</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!sales || sales.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No hay ventas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, ScanLine, Plus, Trash2, Maximize2, Minimize2, ShoppingCart, CreditCard, User, FileText } from 'lucide-react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { useProducts } from '@/modules/products/hooks/use-products';
import { useServices } from '@/modules/services/hooks/use-services';
import { usePaymentMethods } from '@/modules/payment-methods/hooks/use-payment-methods';
import { useCreateSale } from '@/modules/sales/hooks/use-sales';
import { formatCurrency } from '@/shared/utils/format-currency';
import { NumericPadModal } from '@/shared/components/ui/numeric-pad-modal';
import { cn } from '@/shared/lib/utils';

interface CartItem {
  tempId: string;
  type: 'PRODUCT' | 'SERVICE';
  referenceId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  discountPercent: number;
}

export default function PosPage() {
  const { data: products = [] } = useProducts({ isActive: true });
  const { data: services = [] } = useServices();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const createSaleMutation = useCreateSale();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchByBarcode, setSearchByBarcode] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [discountMode, setDiscountMode] = useState<'NONE' | 'ITEM' | 'CART'>('NONE');
  const [cartDiscountPercent, setCartDiscountPercent] = useState(0);
  const [customerAlias, setCustomerAlias] = useState('');
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);
  const [isKioskMode, setIsKioskMode] = useState(false);
  
  const [padConfig, setPadConfig] = useState<{
    isOpen: boolean;
    type: 'QTY' | 'ITEM_DESC' | 'CART_DESC';
    tempId?: string;
    initialValue: number;
    max?: number;
    title: string;
  }>({ isOpen: false, type: 'QTY', initialValue: 0, title: '' });

  const filteredProducts = useMemo(() => {
    if (!searchQuery && !searchByBarcode) return products.slice(0, 10);
    const search = searchQuery.toLowerCase();
    return products.filter((p) => 
      (p.name?.toLowerCase().includes(search)) || 
      (p.sku?.toLowerCase().includes(search)) ||
      (p.barcode && p.barcode.includes(searchQuery))
    );
  }, [products, searchQuery, searchByBarcode]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const rawLineDiscountTotal = cart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity * (item.discountPercent / 100),
      0
    );
    const lineDiscountTotal = discountMode === 'ITEM' ? rawLineDiscountTotal : 0;
    const subtotalAfterLineDiscount = subtotal - lineDiscountTotal;
    const cartDiscountAmount =
      discountMode === 'CART' ? subtotalAfterLineDiscount * (cartDiscountPercent / 100) : 0;
    const total = subtotalAfterLineDiscount - cartDiscountAmount;

    return { subtotal, lineDiscountTotal, cartDiscountAmount, total };
  }, [cart, cartDiscountPercent, discountMode]);

  const addProductToCart = (productId: string) => {
    const product = products.find((item) => item._id === productId);
    if (!product) return;

    setCart((current) => {
      const existing = current.find(
        (item) => item.type === 'PRODUCT' && item.referenceId === product._id && item.discountPercent === 0
      );

      if (existing) {
        return current.map((item) =>
          item.tempId === existing.tempId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          tempId: crypto.randomUUID(),
          type: 'PRODUCT',
          referenceId: product._id!,
          name: product.name,
          unitPrice: product.price,
          quantity: 1,
          discountPercent: 0,
        },
      ];
    });
  };

  const addServiceToCart = (serviceId: string) => {
    const service = services.find((item) => item._id === serviceId && item.isActive);
    if (!service) return;

    setCart((current) => [
      ...current,
      {
        tempId: crypto.randomUUID(),
        type: 'SERVICE',
        referenceId: service._id!,
        name: service.name,
        unitPrice: service.salePrice,
        quantity: 1,
        discountPercent: 0,
      },
    ]);
  };

  const updateCartItem = (tempId: string, patch: Partial<CartItem>) => {
    setCart((current) => current.map((item) => (item.tempId === tempId ? { ...item, ...patch } : item)));
  };

  const removeItem = (tempId: string) => {
    setCart((current) => current.filter((item) => item.tempId !== tempId));
  };

  const confirmSale = useCallback(() => {
    if (cart.length === 0 || !paymentMethodId) return;

    createSaleMutation.mutate(
      {
        paymentMethodId,
        discountMode,
        cartDiscountPercent:
          discountMode === 'CART' && cartDiscountPercent > 0 ? cartDiscountPercent : undefined,
        customerAlias: customerAlias.trim() || undefined,
        notes: notes || undefined,
        items: cart.map((item) => ({
          type: item.type,
          referenceId: item.referenceId,
          quantity: item.quantity,
          discountPercent:
            discountMode === 'ITEM' && item.discountPercent > 0 ? item.discountPercent : undefined,
        })),
      },
      {
        onSuccess: () => {
          setCart([]);
          setNotes('');
          setCustomerAlias('');
          setDiscountMode('NONE');
          setCartDiscountPercent(0);
          setPaymentMethodId('');
        },
      }
    );
  }, [cart, cartDiscountPercent, createSaleMutation, customerAlias, discountMode, notes, paymentMethodId]);

  const toggleKioskMode = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling kiosk mode:', err);
      setIsKioskMode(!isKioskMode);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const isFull = Boolean(document.fullscreenElement);
      setIsKioskMode(isFull);
      if (isFull) {
        setTimeout(() => barcodeInputRef.current?.focus(), 100);
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('pos-kiosk-mode', isKioskMode);
    return () => {
      document.body.classList.remove('pos-kiosk-mode');
    };
  }, [isKioskMode]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') { 
        e.preventDefault(); 
        barcodeInputRef.current?.focus(); 
      }
      if (e.key === 'F9' && !createSaleMutation.isPending) { 
        e.preventDefault(); 
        confirmSale(); 
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmSale, createSaleMutation.isPending]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader heading="Punto de Venta" text="Gestiona tus ventas de forma rápida y sencilla" />
        <Button variant="outline" size="sm" className="rounded-full" onClick={toggleKioskMode}>
          {isKioskMode ? <Minimize2 className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
          {isKioskMode ? 'Salir modo caja' : 'Modo caja'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Main Content Area */}
        <div className="space-y-4 lg:col-span-8">
          {/* Search & Quick Actions */}
          <div className="apple-card p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, SKU o código..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative w-full md:w-64">
                <ScanLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={barcodeInputRef}
                  placeholder="Escanear código (F2)"
                  className="pl-10"
                  value={searchByBarcode}
                  onChange={(e) => setSearchByBarcode(e.target.value)}
                />
              </div>
            </div>

            {/* Services Quick Grid */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">Servicios Rápidos</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {services.filter(s => s.isActive).slice(0, 4).map((service) => (
                  <Button
                    key={service._id}
                    variant="outline"
                    className="h-auto flex-col items-start gap-1 p-4 text-left apple-card border-none bg-secondary/30 hover:bg-secondary/50"
                    onClick={() => addServiceToCart(service._id!)}
                  >
                    <span className="font-semibold text-sm line-clamp-1">{service.name}</span>
                    <span className="text-xs text-primary">{formatCurrency(service.salePrice)}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="apple-card overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="w-[100px]">SKU</TableHead>
                  <TableHead>Producto / Servicio</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right w-[100px]">Stock</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id} className="hover:bg-secondary/10">
                    <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.category || 'Sin categoría'}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        product.quantity > 5 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}>
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0" onClick={() => addProductToCart(product._id!)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Cart / Checkout Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 flex flex-col gap-4">
            <div className="apple-card flex flex-col h-[calc(100vh-10rem)] max-h-[850px]">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" /> Ticket Actual
                </h3>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {cart.length} ítems
                </span>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                    <ShoppingCart className="h-12 w-12" />
                    <p className="text-sm">El carrito está vacío</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.tempId} className="group relative flex flex-col gap-2 p-3 rounded-2xl bg-secondary/20 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold line-clamp-1">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{formatCurrency(item.unitPrice)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeItem(item.tempId)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <button
                            className="h-7 min-w-[3rem] px-2 text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                            onClick={() => setPadConfig({ isOpen: true, type: 'QTY', tempId: item.tempId, initialValue: item.quantity, title: 'Cantidad' })}
                          >
                            {item.quantity}
                          </button>
                          <span className="text-xs text-muted-foreground">x {formatCurrency(item.unitPrice)}</span>
                        </div>
                        <span className="text-sm font-bold">
                          {formatCurrency(
                            item.unitPrice * item.quantity *
                              (1 - (discountMode === 'ITEM' ? item.discountPercent : 0) / 100)
                          )}
                        </span>
                      </div>
                      {discountMode === 'ITEM' && (
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">Desc. ítem (%)</span>
                          <button
                            className="h-7 min-w-[3.5rem] px-2 text-xs font-bold bg-secondary hover:bg-secondary/70 text-secondary-foreground rounded-lg transition-colors border border-border/50"
                            onClick={() => setPadConfig({ isOpen: true, type: 'ITEM_DESC', tempId: item.tempId, initialValue: item.discountPercent, max: 100, title: 'Descuento (%)' })}
                          >
                            {item.discountPercent}%
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Summary & Checkout */}
              <div className="p-4 bg-secondary/10 border-t space-y-4">
                <div className="space-y-2">
                  <div className="rounded-xl border bg-background/40 p-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Descuento
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={discountMode === 'NONE' ? 'default' : 'outline'}
                        className="h-8 rounded-lg text-xs px-2"
                        onClick={() => {
                          setDiscountMode('NONE');
                          setCartDiscountPercent(0);
                          setCart((current) => current.map((item) => ({ ...item, discountPercent: 0 })));
                        }}
                      >
                        Ninguno
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={discountMode === 'ITEM' ? 'default' : 'outline'}
                        className="h-8 rounded-lg text-xs px-2"
                        onClick={() => {
                          setDiscountMode('ITEM');
                          setCartDiscountPercent(0);
                        }}
                      >
                        Por Ítem
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={discountMode === 'CART' ? 'default' : 'outline'}
                        className="h-8 rounded-lg text-xs px-2"
                        onClick={() => {
                          setDiscountMode('CART');
                          setCart((current) => current.map((item) => ({ ...item, discountPercent: 0 })));
                        }}
                      >
                        Global
                      </Button>
                    </div>
                  </div>
                  {discountMode === 'CART' && (
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Desc. global (%)</Label>
                      <button
                        className="h-8 min-w-[3.5rem] px-3 text-sm font-bold bg-secondary hover:bg-secondary/70 text-secondary-foreground rounded-lg transition-colors border border-border/50"
                        onClick={() => setPadConfig({ isOpen: true, type: 'CART_DESC', initialValue: cartDiscountPercent, max: 100, title: 'Descuento Global (%)' })}
                      >
                        {cartDiscountPercent}%
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="w-full bg-transparent text-sm font-medium focus:outline-none"
                      value={paymentMethodId}
                      onChange={(e) => setPaymentMethodId(e.target.value)}
                    >
                      <option value="">Seleccionar método de pago...</option>
                      {paymentMethods.filter(m => m.isActive).map((m) => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cliente (opcional)"
                      className="h-8 border-none bg-transparent p-0 text-sm focus-visible:ring-0"
                      value={customerAlias}
                      onChange={(e) => setCustomerAlias(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-1.5 border-t">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  {totals.lineDiscountTotal > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Desc. por productos</span>
                      <span>-{formatCurrency(totals.lineDiscountTotal)}</span>
                    </div>
                  )}
                  {totals.cartDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Desc. general carrito</span>
                      <span>-{formatCurrency(totals.cartDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary text-xl">{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20"
                  disabled={cart.length === 0 || !paymentMethodId || createSaleMutation.isPending}
                  onClick={confirmSale}
                >
                  {createSaleMutation.isPending ? 'Procesando...' : 'Confirmar Venta (F9)'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NumericPadModal
        isOpen={padConfig.isOpen}
        title={padConfig.title}
        initialValue={padConfig.initialValue}
        max={padConfig.max}
        allowDecimals={false} // Items qty and discounts are kept as integers for simplicity in UI
        onClose={() => setPadConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={(val) => {
          if (padConfig.type === 'QTY' && padConfig.tempId) {
            updateCartItem(padConfig.tempId, { quantity: Math.max(1, val) });
          } else if (padConfig.type === 'ITEM_DESC' && padConfig.tempId) {
            updateCartItem(padConfig.tempId, { discountPercent: val });
          } else if (padConfig.type === 'CART_DESC') {
            setCartDiscountPercent(val);
          }
        }}
      />
    </div>
  );
}

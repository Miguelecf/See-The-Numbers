'use client';

import { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, AlertCircle, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useConfirmProductImport, usePreviewProductImport } from '../hooks/use-products';
import { ProductImportPreviewResult } from '../types/product.types';
import { cn } from '@/shared/lib/utils';

export function ProductImportPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ProductImportPreviewResult | null>(null);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [confirmMissingSku, setConfirmMissingSku] = useState(false);

  const previewMutation = usePreviewProductImport();
  const confirmMutation = useConfirmProductImport();

  const updateRows = useMemo(
    () => (preview?.rows || []).filter((row) => row.action === 'update'),
    [preview]
  );

  const hasMissingSku = (preview?.missingSkuCount || 0) > 0;

  const handlePreview = () => {
    if (!file) return;

    previewMutation.mutate(file, {
      onSuccess: (data) => {
        setPreview(data);
        setSelectedSkus([]);
        setConfirmMissingSku(false);
      },
    });
  };

  const toggleSku = (sku: string, checked: boolean) => {
    setSelectedSkus((current) => {
      if (checked) return [...new Set([...current, sku])];
      return current.filter((value) => value !== sku);
    });
  };

  const handleConfirm = () => {
    if (!file || !preview) return;
    
    // Si hay productos sin SKU y no confirmó, no dejamos pasar
    if (hasMissingSku && !confirmMissingSku) {
      return;
    }

    confirmMutation.mutate(
      { file, replaceSkus: selectedSkus },
      {
        onSuccess: () => {
          setPreview(null);
          setSelectedSkus([]);
          setFile(null);
          setConfirmMissingSku(false);
        },
      }
    );
  };

  return (
    <div className="apple-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Importación Inteligente</h3>
            <p className="text-sm text-muted-foreground">Sube tu Excel o CSV usando nuestra plantilla (EN)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-2" asChild>
            <a href="/templates/import_products_en.xlsx" download>
              <Download className="h-3.5 w-3.5" /> Descargar Plantilla
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr,auto]">
        <div className="relative group">
          <Input
            id="product-import-file"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <Label
            htmlFor="product-import-file"
            className={cn(
              "flex h-12 cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed px-4 transition-all hover:bg-secondary/30",
              file ? "border-primary/50 bg-primary/5" : "border-border/60"
            )}
          >
            <span className="text-sm font-medium">
              {file ? file.name : "Selecciona o arrastra tu archivo aquí..."}
            </span>
            <Button variant="ghost" size="sm" className="h-8 rounded-full pointer-events-none">
              Explorar
            </Button>
          </Label>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handlePreview} 
            disabled={!file || previewMutation.isPending}
            className="rounded-2xl h-12 px-6"
          >
            {previewMutation.isPending ? 'Analizando...' : 'Analizar Archivo'}
          </Button>
          {preview && (
            <Button
              variant="default"
              onClick={handleConfirm}
              disabled={confirmMutation.isPending || (hasMissingSku && !confirmMissingSku)}
              className={cn(
                "rounded-2xl h-12 px-6 transition-all",
                hasMissingSku && !confirmMissingSku 
                  ? "bg-secondary text-muted-foreground cursor-not-allowed" 
                  : "bg-success hover:bg-success/90 text-white"
              )}
            >
              {confirmMutation.isPending ? 'Importando...' : 'Confirmar Todo'}
            </Button>
          )}
        </div>
      </div>

      {preview && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="apple-card p-4 bg-primary/5 border-primary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-tighter">Nuevos</p>
              <p className="text-2xl font-bold">{preview.creates}</p>
            </div>
            <div className="apple-card p-4 bg-accent/5 border-accent/20">
              <p className="text-xs font-bold text-accent uppercase tracking-tighter">Actualizar</p>
              <p className="text-2xl font-bold">{preview.updates}</p>
            </div>
            <div className="apple-card p-4 bg-amber-500/5 border-amber-500/20 text-amber-600">
              <p className="text-xs font-bold uppercase tracking-tighter">Sin SKU</p>
              <p className="text-2xl font-bold">{preview.missingSkuCount}</p>
            </div>
            <div className="apple-card p-4 bg-secondary/50">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Sin cambios</p>
              <p className="text-2xl font-bold">{preview.unchanged}</p>
            </div>
            <div className="apple-card p-4 bg-destructive/5 border-destructive/20 text-destructive">
              <p className="text-xs font-bold uppercase tracking-tighter">Inválidos</p>
              <p className="text-2xl font-bold">{preview.invalid}</p>
            </div>
          </div>

          {hasMissingSku && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-900 font-medium">
                  Se detectaron <strong>{preview.missingSkuCount}</strong> productos sin SKU. 
                  <span className="block text-xs font-normal opacity-80">Aunque puedes cargarlos así, se recomienda que cada producto tenga un código único para evitar duplicados.</span>
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white/50 px-4 py-2 rounded-full border border-amber-500/30 hover:bg-white/80 transition-colors">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-amber-500 text-amber-600 focus:ring-amber-500"
                  checked={confirmMissingSku}
                  onChange={(e) => setConfirmMissingSku(e.target.checked)}
                />
                <span className="text-sm font-bold text-amber-700">¿Lo quieres cargar igual sin SKU?</span>
              </label>
            </div>
          )}

          {updateRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <AlertCircle className="h-4 w-4 text-accent" />
                <h4 className="text-sm font-semibold">Confirmar reemplazos de SKU existentes</h4>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 rounded-2xl border bg-secondary/10 p-4 scrollbar-hide">
                {updateRows.map((row) => (
                  <div key={`${row.row}-${row.sku}`} className="apple-card p-3 bg-card border-border/40 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`sku-${row.sku}`}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          checked={selectedSkus.includes(row.sku)}
                          onChange={(event) => toggleSku(row.sku, event.target.checked)}
                        />
                        <label htmlFor={`sku-${row.sku}`} className="font-bold text-sm cursor-pointer">{row.sku}</label>
                      </div>
                      <span className="text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full uppercase">Update</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      {row.changedFields.map((change) => (
                        <div key={`${row.sku}-${String(change.field)}`} className="text-xs flex items-center justify-between gap-2 text-muted-foreground">
                          <span className="capitalize">{String(change.field)}:</span>
                          <div className="flex items-center gap-1 overflow-hidden">
                            <span className="line-clamp-1 truncate">{String(change.oldValue ?? '')}</span>
                            <ChevronRight className="h-2 w-2 shrink-0" />
                            <span className="text-foreground font-medium line-clamp-1 truncate">{String(change.newValue ?? '')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {preview.rows.some((row) => row.action === 'invalid') && (
            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" /> Errores detectados
              </h4>
              <div className="space-y-1">
                {preview.rows
                  .filter((row) => row.action === 'invalid')
                  .slice(0, 5)
                  .map((row) => (
                    <p key={`invalid-${row.row}`} className="text-xs">Fila {row.row}: {row.message}</p>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

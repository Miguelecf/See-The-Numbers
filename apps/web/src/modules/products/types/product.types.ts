export interface Product {
  _id?: string;
  barcode?: string;
  sku: string;
  name: string;
  supplier: string;
  unitOfMeasure: string;
  cost: number;
  quantity: number;
  price: number;
  category?: string;
  laboratory: string;
  stockMinimum?: number;
  notes?: string;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  profit: number;
  marginPercent: number;
  isLowStock: boolean;
}

export interface ProductFilters {
  category?: string;
  supplier?: string;
  laboratory?: string;
  isActive?: boolean;
  search?: string;
}

export interface ProductImportFieldChange {
  field: keyof Product;
  oldValue: unknown;
  newValue: unknown;
}

export interface ProductImportPreviewRow {
  row: number;
  sku: string;
  action: 'create' | 'update' | 'no_changes' | 'invalid' | 'warning';
  values: Record<string, unknown>;
  changedFields: ProductImportFieldChange[];
  message?: string;
}

export interface ProductImportPreviewResult {
  totalRows: number;
  creates: number;
  updates: number;
  unchanged: number;
  invalid: number;
  missingSkuCount: number;
  rows: ProductImportPreviewRow[];
}

export interface ProductImportConfirmResult {
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; sku: string; message: string }>;
}

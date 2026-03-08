import { BadRequestError } from '../../../shared/errors/app-error';
import { Product } from '../domain/product.entity';
import { ProductRepository } from '../infrastructure/product.repository';
import { CategoryRepository } from '../../categories/infrastructure/category.repository';
import { mapRowToProduct, ImportableProduct } from './import-product-row.mapper';
import { createProductUseCase } from './create-product.use-case';
import * as XLSX from 'xlsx';

const IMPORT_COMPARABLE_FIELDS: Array<keyof ImportableProduct> = [
  'barcode',
  'name',
  'supplier',
  'unitOfMeasure',
  'cost',
  'quantity',
  'price',
  'category',
  'laboratory',
];

export interface ProductImportFieldChange {
  field: keyof ImportableProduct;
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

interface ParsedImportRow {
  row: number;
  originalValues: Record<string, unknown>;
  product: ImportableProduct;
}

const parseRowsFromFile = (buffer: Buffer): Record<string, unknown>[] => {
  // Forzar codepage 65001 (UTF-8) para CSVs con acentos en español
  const workbook = XLSX.read(buffer, { type: 'buffer', codepage: 65001 });
  const firstSheet = workbook.SheetNames[0];

  if (!firstSheet) {
    throw new BadRequestError('El archivo de importación no tiene hojas.');
  }

  const worksheet = workbook.Sheets[firstSheet];
  return XLSX.utils.sheet_to_json(worksheet, {
    raw: false,
    defval: '',
    blankrows: false,
  }) as Record<string, unknown>[];
};

const areValuesEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if ((a === undefined || a === null || a === '') && (b === undefined || b === null || b === '')) {
    return true;
  }
  return String(a) === String(b);
};

const getChangedFields = (
  existing: Product,
  incoming: ImportableProduct
): ProductImportFieldChange[] => {
  const changedFields: ProductImportFieldChange[] = [];

  for (const field of IMPORT_COMPARABLE_FIELDS) {
    const oldValue = existing[field];
    const newValue = incoming[field];

    if (!areValuesEqual(oldValue, newValue)) {
      changedFields.push({
        field,
        oldValue,
        newValue,
      });
    }
  }

  return changedFields;
};

const parseImportRows = (fileBuffer: Buffer) => {
  const rows = parseRowsFromFile(fileBuffer);

  if (rows.length === 0) {
    throw new BadRequestError('El archivo de importación está vacío.');
  }

  const parsedRows: ParsedImportRow[] = [];
  const invalidRows: ProductImportPreviewRow[] = [];
  const seenSkus = new Set<string>();

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const rowNumber = index + 2; // +1 por 0-index, +1 por encabezado

    try {
      // Ignorar filas que no tienen absolutamente nada de texto
      const hasContent = Object.values(row).some(v => v !== undefined && v !== null && String(v).trim().length > 0);
      if (!hasContent) continue;

      const parsed = mapRowToProduct(row);

      if (parsed.sku && seenSkus.has(parsed.sku)) {
        invalidRows.push({
          row: rowNumber,
          sku: parsed.sku,
          action: 'invalid',
          values: row,
          changedFields: [],
          message: 'SKU duplicado en el archivo',
        });
        continue;
      }

      if (parsed.sku) seenSkus.add(parsed.sku);

      parsedRows.push({
        row: rowNumber,
        originalValues: row,
        product: parsed,
      });
    } catch (error: any) {
      let message = 'Formato de fila inválido o faltan campos obligatorios';
      
      // Si el error viene de Zod, tratamos de dar un mensaje más específico
      if (error?.errors && Array.isArray(error.errors)) {
        const firstError = error.errors[0];
        const field = firstError.path.join('.');
        message = `Error en el campo '${field}': ${firstError.message}`;
      } else if (error?.message) {
        message = error.message;
      }

      invalidRows.push({
        row: rowNumber,
        sku: (row as any).sku || (row as any).SKU || 'Sin SKU',
        action: 'invalid',
        values: row,
        changedFields: [],
        message,
      });
    }
  }

  return { parsedRows, invalidRows };
};

export const previewProductsImportUseCase = async (
  repository: ProductRepository,
  fileBuffer: Buffer
): Promise<ProductImportPreviewResult> => {
  const { parsedRows, invalidRows } = parseImportRows(fileBuffer);
  const existingProducts = await repository.findBySkus(
    parsedRows.map((item) => item.product.sku).filter(Boolean) as string[]
  );
  const existingBySku = new Map(existingProducts.map((product) => [product.sku, product]));

  const rows: ProductImportPreviewRow[] = [...invalidRows];
  let creates = 0;
  let updates = 0;
  let unchanged = 0;
  let missingSkuCount = 0;

  for (const parsedRow of parsedRows) {
    if (!parsedRow.product.sku) {
      missingSkuCount += 1;
      creates += 1;
      rows.push({
        row: parsedRow.row,
        sku: 'SIN-SKU',
        action: 'warning',
        values: parsedRow.originalValues,
        changedFields: [],
        message: 'Producto sin SKU (se recomienda tener uno)',
      });
      continue;
    }

    const existing = existingBySku.get(parsedRow.product.sku);

    if (!existing) {
      creates += 1;
      rows.push({
        row: parsedRow.row,
        sku: parsedRow.product.sku,
        action: 'create',
        values: parsedRow.originalValues,
        changedFields: [],
      });
      continue;
    }

    const changedFields = getChangedFields(existing, parsedRow.product);
    if (changedFields.length === 0) {
      unchanged += 1;
      rows.push({
        row: parsedRow.row,
        sku: parsedRow.product.sku,
        action: 'no_changes',
        values: parsedRow.originalValues,
        changedFields: [],
        message: 'El producto ya está actualizado',
      });
      continue;
    }

    updates += 1;
    rows.push({
      row: parsedRow.row,
      sku: parsedRow.product.sku,
      action: 'update',
      values: parsedRow.originalValues,
      changedFields,
      message: 'El SKU ya existe. Se requiere confirmación para actualizar.',
    });
  }

  rows.sort((a, b) => a.row - b.row);

  return {
    totalRows: rows.length,
    creates,
    updates,
    unchanged,
    invalid: invalidRows.length,
    missingSkuCount,
    rows,
  };
};

export const confirmProductsImportUseCase = async (
  productRepository: ProductRepository,
  categoryRepository: CategoryRepository,
  fileBuffer: Buffer,
  replaceSkus: string[]
): Promise<ProductImportConfirmResult> => {
  const replaceSet = new Set(replaceSkus);
  const { parsedRows } = parseImportRows(fileBuffer);
  const skus = parsedRows
    .map((item) => item.product.sku)
    .filter((sku): sku is string => Boolean(sku));
  const existingProducts = await productRepository.findBySkus(skus);
  const existingBySku = new Map(existingProducts.map((product) => [product.sku, product]));

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: Array<{ row: number; sku: string; message: string }> = [];

  for (const parsedRow of parsedRows) {
    const sku = parsedRow.product.sku;
    const existing = sku ? existingBySku.get(sku) : undefined;

    try {
      // Procesar Categoría (Jerárquica)
      let categoryId: string | undefined;
      if (parsedRow.product.category) {
        categoryId = await categoryRepository.findOrCreateByPath(parsedRow.product.category);
      }

      const productData = {
        ...parsedRow.product,
        categoryId,
        isActive: true,
      };

      if (!existing) {
        await createProductUseCase(productRepository, productData);
        created += 1;
        continue;
      }

      const changedFields = getChangedFields(existing, parsedRow.product);
      if (changedFields.length === 0) {
        skipped += 1;
        continue;
      }

      if (!sku || !replaceSet.has(sku)) {
        skipped += 1;
        continue;
      }

      await productRepository.update(existing._id!, productData);
      updated += 1;
    } catch (error: any) {
      errors.push({
        row: parsedRow.row,
        sku: sku || 'SIN-SKU',
        message: error?.message ?? 'Error al importar fila',
      });
    }
  }

  return {
    created,
    updated,
    skipped,
    errors,
  };
};

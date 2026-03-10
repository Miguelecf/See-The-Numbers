import { z } from 'zod';

// ── String helpers ──────────────────────────────────────────────────────────

const parseOptionalString = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === undefined || value === null) return undefined;
    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : undefined;
  });

const parseRequiredString = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .pipe(z.string().min(1));

// ── Numeric helpers ─────────────────────────────────────────────────────────
// Accepts plain integers (28000), decimals with dot (100.50) or comma (100,50).
// Also handles ES-locale thousands separators (2.518,03 → 2518.03).

const cleanNumericValue = (val: unknown): number | undefined => {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number') return val;

  if (typeof val === 'string') {
    let cleaned = val.trim();
    // ES-locale: "2.518,03" → remove thousand-dots, swap comma → dot
    if (cleaned.includes(',')) {
      cleaned = cleaned.replace(/\./g, '');
      cleaned = cleaned.replace(',', '.');
    }
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

// ── Zod schema ──────────────────────────────────────────────────────────────
// Required fields: Name, Quantity, Cost, Price
// Everything else is optional with sensible defaults.

export const productImportSchema = z
  .object({
    barcode: parseOptionalString,
    sku: parseOptionalString,
    name: parseRequiredString,
    supplier: parseOptionalString.transform((val) => val || 'General'),
    unitOfMeasure: parseOptionalString.transform((val) => val || 'Unidad'),
    cost: z.preprocess(
      (val) => cleanNumericValue(val),
      z.number({ required_error: 'Cost is required', invalid_type_error: 'Invalid cost' }).min(0),
    ),
    quantity: z.preprocess(
      (val) => cleanNumericValue(val),
      z.number({ required_error: 'Quantity is required', invalid_type_error: 'Invalid quantity' }).min(0),
    ),
    price: z.preprocess(
      (val) => cleanNumericValue(val),
      z.number({ required_error: 'Price is required', invalid_type_error: 'Invalid price' }).positive(),
    ),
    category: parseOptionalString,
    laboratory: parseOptionalString.transform((val) => val || 'Sin Marca'),
  })
  .refine((data) => data.price >= data.cost, {
    message: 'Price cannot be lower than cost — selling at a loss is not allowed',
    path: ['price'],
  });

export type ImportableProduct = z.infer<typeof productImportSchema>;

// ── Header aliases (EN + ES) ────────────────────────────────────────────────

const HEADER_ALIASES: Record<string, keyof ImportableProduct> = {
  // English
  'barcode': 'barcode', 'bar code': 'barcode', 'ean': 'barcode',
  'sku': 'sku', 'ref': 'sku', 'reference': 'sku',
  'name': 'name', 'product': 'name', 'description': 'name',
  'supplier': 'supplier', 'vendor': 'supplier',
  'unit': 'unitOfMeasure', 'unitofmeasure': 'unitOfMeasure', 'unit of measure': 'unitOfMeasure',
  'cost': 'cost',
  'quantity': 'quantity', 'qty': 'quantity', 'stock': 'quantity',
  'price': 'price',
  'category': 'category',
  'laboratory': 'laboratory', 'lab': 'laboratory', 'brand': 'laboratory',
  // Spanish
  'codigo de barras': 'barcode', 'código de barras': 'barcode', 'codigo': 'barcode', 'código': 'barcode',
  'referencia': 'sku',
  'nombre': 'name', 'producto': 'name', 'descripcion': 'name', 'descripción': 'name',
  'proveedor': 'supplier', 'distribuidor': 'supplier',
  'unidad': 'unitOfMeasure', 'unidad de medida': 'unitOfMeasure',
  'costo': 'cost', 'compra': 'cost', 'valor de compra': 'cost',
  'cantidad': 'quantity',
  'precio': 'price', 'venta': 'price', 'valor de venta': 'price',
  'categoria': 'category', 'categoría': 'category', 'rubro': 'category',
  'laboratorio': 'laboratory', 'marca': 'laboratory',
};

// ── Row mapper ──────────────────────────────────────────────────────────────

export const mapRowToProduct = (row: Record<string, unknown>): ImportableProduct => {
  const mapped: Partial<ImportableProduct> = {};

  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = key.trim().toLowerCase();
    const field = HEADER_ALIASES[normalizedKey];
    if (field) {
      mapped[field] = value as any;
    }
  }

  // Fallback: if no name was matched, grab the first long-ish string
  if (!mapped.name) {
    const possibleName = Object.values(row).find((v) => typeof v === 'string' && v.length > 5);
    if (possibleName) mapped.name = possibleName as string;
  }

  return productImportSchema.parse(mapped);
};

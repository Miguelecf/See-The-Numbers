import { z } from 'zod';

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

// Esquema mucho más flexible para evitar errores de validación
export const productImportSchema = z.object({
  barcode: parseOptionalString,
  sku: parseOptionalString,
  name: parseRequiredString, // El nombre sigue siendo lo único sagrado
  supplier: parseOptionalString.transform(val => val || 'General'),
  unitOfMeasure: parseOptionalString.transform(val => val || 'Unidad'),
  cost: z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val.replace(',', '.'));
    return val;
  }, z.coerce.number().min(0).default(0)),
  quantity: z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val.replace(',', '.'));
    return val;
  }, z.coerce.number().min(0).default(0)),
  price: z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val.replace(',', '.'));
    return val;
  }, z.coerce.number().positive().default(1)),
  category: parseOptionalString,
  laboratory: parseOptionalString.transform(val => val || 'Sin Marca'),
});

export type ImportableProduct = z.infer<typeof productImportSchema>;

const HEADER_ALIASES: Record<string, keyof ImportableProduct> = {
  'barcode': 'barcode', 'codigo de barras': 'barcode', 'código de barras': 'barcode', 'codigo': 'barcode', 'código': 'barcode', 'ean': 'barcode',
  'sku': 'sku', 'referencia': 'sku', 'ref': 'sku',
  'name': 'name', 'nombre': 'name', 'producto': 'name', 'descripcion': 'name', 'descripción': 'name',
  'supplier': 'supplier', 'proveedor': 'supplier', 'distribuidor': 'supplier',
  'unitofmeasure': 'unitOfMeasure', 'unidad de medida': 'unitOfMeasure', 'unidad': 'unitOfMeasure', 'unit': 'unitOfMeasure',
  'cost': 'cost', 'costo': 'cost', 'compra': 'cost', 'valor de compra': 'cost',
  'quantity': 'quantity', 'cantidad': 'quantity', 'stock': 'quantity',
  'price': 'price', 'precio': 'price', 'venta': 'price', 'valor de venta': 'price',
  'category': 'category', 'categoria': 'category', 'categoría': 'category', 'rubro': 'category',
  'laboratory': 'laboratory', 'laboratorio': 'laboratory', 'lab': 'laboratory', 'marca': 'laboratory',
};

export const mapRowToProduct = (row: Record<string, unknown>): ImportableProduct => {
  const mapped: Partial<ImportableProduct> = {};

  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = key.trim().toLowerCase();
    const field = HEADER_ALIASES[normalizedKey];
    if (field) {
      mapped[field] = value as any;
    }
  }

  // Si no hay nombre, intentamos buscar en cualquier columna que parezca un nombre
  if (!mapped.name) {
    const possibleName = Object.values(row).find(v => typeof v === 'string' && v.length > 5);
    if (possibleName) mapped.name = possibleName as string;
  }

  return productImportSchema.parse(mapped);
};

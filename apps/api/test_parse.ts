import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { productImportSchema, mapRowToProduct } from './src/modules/products/application/import-product-row.mapper';

const buf = fs.readFileSync('../web/public/templates/import_products_en.csv');
const workbook = XLSX.read(buf, { type: 'buffer', codepage: 65001 });
const firstSheet = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheet];
const rows = XLSX.utils.sheet_to_json(worksheet, {
  raw: false,
  defval: '',
  blankrows: false,
}) as Record<string, unknown>[];

console.log('EN first row parsed by XLSX:', rows[0]);
console.log('Mapped to product:', mapRowToProduct(rows[0]));

const bufEs = fs.readFileSync('../web/public/templates/plantilla_carga_v1.csv');
const workbookEs = XLSX.read(bufEs, { type: 'buffer', codepage: 65001 });
const firstSheetEs = workbookEs.SheetNames[0];
const worksheetEs = workbookEs.Sheets[firstSheetEs];
const rowsEs = XLSX.utils.sheet_to_json(worksheetEs, {
  raw: false,
  defval: '',
  blankrows: false,
}) as Record<string, unknown>[];

console.log('ES first row parsed by XLSX:', rowsEs[0]);
console.log('Mapped to product (ES):', mapRowToProduct(rowsEs[0]));

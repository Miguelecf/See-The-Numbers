import * as XLSX from 'xlsx';
import * as fs from 'fs';

const buf = fs.readFileSync('../web/public/templates/import_products_en.csv');
const workbook = XLSX.read(buf, { type: 'buffer', codepage: 65001 });
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

const rowsRaw = XLSX.utils.sheet_to_json(worksheet, {
  raw: true,
  defval: '',
  blankrows: false,
}) as Record<string, unknown>[];

console.log('EN first row (raw: true):', rowsRaw[0]);

const rowsFormatted = XLSX.utils.sheet_to_json(worksheet, {
  raw: false,
  defval: '',
  blankrows: false,
}) as Record<string, unknown>[];
console.log('EN first row (raw: false):', rowsFormatted[0]);

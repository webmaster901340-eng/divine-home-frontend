// Writes scripts/catalogue-bulk-upload.xlsx from catalogue-products.json in the admin "Bulk Upload" format,
// so the whole catalogue can be imported (or re-imported) from the CMS in one go.
// Usage: node scripts/catalogue-to-sheet.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import * as XLSX from 'xlsx';

const SITE = 'https://www.divinehomeindia.com';
const products = JSON.parse(readFileSync(new URL('./catalogue-products.json', import.meta.url), 'utf8'));
const headers = ['SKU', 'Title', 'Category', 'Series', 'Design Name', 'Design No', 'Description', 'MOQ', 'Wholesale Price', 'MRP',
  'Badge', 'Bestseller', 'New Arrival', 'Material', 'Finish', 'Dimensions', 'Weight', 'Packaging', 'Images'];
const rows = products.map((p) => [
  p.sku, p.title, p.category, p.series || '', p.designName || '', p.designNo || '', p.description || '', p.moq || 'On request',
  p.wholesalePrice || '', p.mrp || '', p.badge || '', p.isBestseller ? 'Yes' : 'No', p.isNewArrival ? 'Yes' : 'No',
  p.specs?.material || '', p.specs?.finish || '', p.specs?.dimensions || '', p.specs?.weight || '', p.specs?.packaging || '',
  (p.images || []).map((i) => (i.startsWith('http') ? i : `${SITE}${i}`)).join(', '),
]);
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
ws['!cols'] = headers.map((h) => ({ wch: ['Title', 'Description', 'Images'].includes(h) ? 50 : 18 }));
XLSX.utils.book_append_sheet(wb, ws, 'Products');
const out = new URL('./catalogue-bulk-upload.xlsx', import.meta.url);
writeFileSync(out, XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
console.log(`wrote ${rows.length} products -> scripts/catalogue-bulk-upload.xlsx`);

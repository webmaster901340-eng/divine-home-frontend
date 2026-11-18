import React, { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../../utils/api';
import { slugify } from '../../utils/slug';

// Bulk product upload: download a sample sheet, fill it in Excel / Google Sheets, pick all product photos at
// once, preview, then import. Photos go to Cloudinary (same unsigned preset the rest of the admin uses);
// products are upserted by SKU through POST /api/admin/products/import.

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/cm8nznam/image/upload';
const UPLOAD_PRESET = 'divine_preset';

const COLUMNS = [
  ['SKU', 'Required. Unique code, e.g. DHI-5001. Same SKU again = update that product.'],
  ['Title', 'Required. Product name buyers search for, e.g. "Elegant Vector Tray Set (Ellite Series 5001)". Keep under 70 characters.'],
  ['Category', 'Required. Must be one of the categories listed below.'],
  ['Series', 'e.g. Ellite Series. A new series name is created automatically.'],
  ['Design Name', 'e.g. Elegant Vector'],
  ['Design No', 'e.g. 5001'],
  ['Description', '2-4 sentences: what it is, sizes, finish, who it suits. Leave blank and an SEO description is written for you.'],
  ['MOQ', 'e.g. 12 sets or On request'],
  ['Wholesale Price', 'Number only. Leave blank or 0 to show "Price on request".'],
  ['MRP', 'Number only. Leave blank or 0 to hide.'],
  ['Badge', 'BESTSELLER, NEW ARRIVAL, EXCLUSIVE or blank'],
  ['Bestseller', 'Yes / No'],
  ['New Arrival', 'Yes / No'],
  ['Material', ''],
  ['Finish', ''],
  ['Dimensions', 'e.g. 18x12 in, 16x10 in'],
  ['Weight', ''],
  ['Packaging', 'e.g. Gift box'],
  ['Images', 'Photo file names separated by commas, e.g. dhi-5001-front.jpg, dhi-5001-set.jpg (first one is the main photo). Full https:// links also work. Leave blank to auto-use photos whose file name starts with the SKU.'],
];
const HEADERS = COLUMNS.map(([h]) => h);

const SAMPLE_ROWS = [
  ['DHI-5001', 'Elegant Vector Tray Set (Ellite Series 5001)', 'Trays & Serving Platters', 'Ellite Series', 'Elegant Vector', '5001',
    'Gold star line-work on a white base with a hammered metal rim. Set includes rectangle, oval, square and round trays, a candy box and coasters.',
    'On request', '', '', 'BESTSELLER', 'Yes', 'No', 'MDF with printed top', 'Gold rim', '18x12 in, 16x10 in', '', 'Gift box', 'dhi-5001-front.jpg, dhi-5001-set.jpg'],
  ['DHI-2603', 'Peacock Mango Wood Tray Set (Design 2603)', 'Artisan Trays & Platters', 'Mangowood Series', 'Peacock', '2603',
    '', 'On request', '', '', '', 'No', 'Yes', 'Mango wood', 'Hand-printed', '', '', '', ''],
];

const yes = (v) => /^(y|yes|true|1)$/i.test(String(v ?? '').trim());
const num = (v) => { const n = Number(String(v ?? '').replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0; };
const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
const baseName = (name) => name.toLowerCase().replace(/\.[a-z0-9]+$/, '');
const deliveryUrl = (url) => url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');

const seoDescription = (p) => {
  const bits = [
    `${p.title}${p.designName && !p.title.includes(p.designName) ? `, ${p.designName} design` : ''}.`,
    `Wholesale ${p.category.toLowerCase()}${p.series ? ` from our ${p.series}` : ''} for gift shops, home decor stores, hotels and corporate gifting.`,
    p.specs.dimensions ? `Sizes: ${p.specs.dimensions}.` : '',
    p.specs.finish ? `Finish: ${p.specs.finish}.` : '',
    'Designed by Divine Home India, Karol Bagh, New Delhi. Trade price and MOQ on request, delivery across India.',
  ];
  return bits.filter(Boolean).join(' ');
};

// Shrinks big photos in the browser before upload (faster pages, under Cloudinary's 10 MB limit).
const prepareImage = (file) => new Promise((resolve) => {
  if (file.size < 1.5 * 1024 * 1024 || !/^image\/(jpeg|png|webp)$/.test(file.type)) return resolve(file);
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const scale = Math.min(1, 2000 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => { URL.revokeObjectURL(url); resolve(blob || file); }, 'image/jpeg', 0.86);
  };
  img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
  img.src = url;
});

const uploadImage = async (file, publicId) => {
  const body = new FormData();
  body.append('file', await prepareImage(file));
  body.append('upload_preset', UPLOAD_PRESET);
  body.append('folder', 'divine-home/products');
  body.append('public_id', publicId); // SEO-friendly file name, e.g. elegant-vector-tray-set-1-k3f9
  let res = await fetch(CLOUDINARY_URL, { method: 'POST', body });
  if (!res.ok) { // preset may not allow custom names: retry without
    body.delete('public_id');
    res = await fetch(CLOUDINARY_URL, { method: 'POST', body });
  }
  const data = await res.json();
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message || `upload failed (${res.status})`);
  return deliveryUrl(data.secure_url);
};

const loadXlsx = () => import('xlsx');

const BulkUpload = ({ products, getAuthHeaders, onDone, setToast }) => {
  const [categories, setCategories] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  useEffect(() => {
    const names = (d) => (Array.isArray(d) ? d.map((x) => x.name).filter(Boolean) : []);
    fetch(`${API_BASE_URL}/api/categories`).then((r) => r.json()).then((d) => setCategories(names(d))).catch(() => {});
    fetch(`${API_BASE_URL}/api/series`).then((r) => r.json()).then((d) => setSeriesList(names(d))).catch(() => {});
  }, []);
  const [rows, setRows] = useState([]);
  const [sheetName, setSheetName] = useState('');
  const [files, setFiles] = useState([]);
  const [autoSeo, setAutoSeo] = useState(true);
  const [removeMissing, setRemoveMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [report, setReport] = useState(null);

  const categoryNames = useMemo(() => (categories.length ? categories : ['Trays & Serving Platters', 'Artisan Trays & Platters', 'Organizers & Holders', 'Tableware & Dining', 'Crockery']), [categories]);
  const existingSkus = useMemo(() => new Set(products.map((p) => p.sku)), [products]);

  const thumbs = useMemo(() => new Map(files.map((f) => [f, URL.createObjectURL(f)])), [files]);
  useEffect(() => () => thumbs.forEach((u) => URL.revokeObjectURL(u)), [thumbs]);

  const fileIndex = useMemo(() => {
    const byName = new Map();
    files.forEach((f) => { byName.set(f.name.toLowerCase(), f); byName.set(baseName(f.name), f); });
    return byName;
  }, [files]);

  // ---------- Downloads ----------
  const downloadWorkbook = async (dataRows, fileName) => {
    const XLSX = await loadXlsx();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...dataRows]);
    ws['!cols'] = HEADERS.map((h) => ({ wch: ['Title', 'Description', 'Images'].includes(h) ? 50 : 18 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    const help = [
      ['Column', 'What to enter'], ...COLUMNS, [], ['Allowed categories', ''],
      ...categoryNames.map((c) => [c, '']), [], ['Existing series', ''], ...seriesList.map((s) => [s, '']), [],
      ['Photos', 'Name photo files clearly (e.g. dhi-5001-front.jpg). JPG/PNG/WebP. Big photos are resized automatically.'],
      ['SEO tips', 'Use the words buyers search: "decorative tray set", "mango wood tray", "gift set". One product per row. Each SKU only once.'],
    ];
    const hs = XLSX.utils.aoa_to_sheet(help);
    hs['!cols'] = [{ wch: 26 }, { wch: 110 }];
    XLSX.utils.book_append_sheet(wb, hs, 'Instructions');
    XLSX.writeFile(wb, fileName);
  };

  const downloadSample = () => downloadWorkbook(SAMPLE_ROWS, 'divine-home-bulk-upload-sample.xlsx');

  const downloadCurrent = () => downloadWorkbook(products.map((p) => [
    p.sku, p.title, p.category, p.series || '', p.designName || '', p.designNo || '', p.description || '', p.moq || '',
    p.wholesalePrice || '', p.mrp || '', p.badge || '', p.isBestseller ? 'Yes' : 'No', p.isNewArrival ? 'Yes' : 'No',
    p.specs?.material || '', p.specs?.finish || '', p.specs?.dimensions || '', p.specs?.weight || '', p.specs?.packaging || '',
    (p.images || []).join(', '),
  ]), `divine-home-catalogue-${new Date().toISOString().slice(0, 10)}.xlsx`);

  // ---------- Reading the sheet ----------
  const readSheet = async (file) => {
    setReport(null);
    try {
      const XLSX = await loadXlsx();
      const wb = XLSX.read(await file.arrayBuffer());
      const ws = wb.Sheets[wb.SheetNames.includes('Products') ? 'Products' : wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
      const norm = (k) => String(k).toLowerCase().replace(/[^a-z]/g, '');
      const parsed = raw
        .map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [norm(k), clean(v)])))
        .filter((r) => r.sku || r.title);
      setRows(parsed);
      setSheetName(file.name);
      if (!parsed.length) setToast({ message: 'No product rows found in that sheet', type: 'error' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Could not read the sheet. Use .xlsx or .csv', type: 'error' });
    }
  };

  // ---------- Building products + validation ----------
  const plan = useMemo(() => {
    const skuCount = rows.reduce((m, r) => m.set(r.sku, (m.get(r.sku) || 0) + 1), new Map());
    return rows.map((r, i) => {
      const errors = [];
      const warnings = [];
      const p = {
        sku: r.sku, title: r.title, category: r.category, series: r.series, designName: r.designname, designNo: r.designno,
        description: r.description, moq: r.moq, wholesalePrice: num(r.wholesaleprice), mrp: num(r.mrp),
        badge: r.badge.toUpperCase(), isBestseller: yes(r.bestseller), isNewArrival: yes(r.newarrival),
        specs: { material: r.material, finish: r.finish, dimensions: r.dimensions, weight: r.weight, packaging: r.packaging },
      };
      if (!p.sku) errors.push('SKU missing');
      if (!p.title) errors.push('Title missing');
      if (!p.category) errors.push('Category missing');
      else if (!categoryNames.includes(p.category)) errors.push(`Unknown category "${p.category}"`);
      if (p.sku && skuCount.get(p.sku) > 1) errors.push('SKU repeated in sheet');
      if (p.title.length > 70) warnings.push('Title over 70 characters (cut off in Google)');

      // Images: listed names / links, or files starting with the SKU
      const tokens = (r.images || '').split(/[,|;\n]+/).map((t) => t.trim()).filter(Boolean);
      const images = [];
      const missing = [];
      tokens.forEach((t) => {
        if (/^https?:\/\//i.test(t)) images.push({ url: t });
        else {
          const f = fileIndex.get(t.toLowerCase()) || fileIndex.get(baseName(t));
          if (f) images.push({ file: f }); else missing.push(t);
        }
      });
      if (!tokens.length && p.sku) {
        const prefix = p.sku.toLowerCase();
        files.filter((f) => baseName(f.name).startsWith(prefix)).sort((a, b) => a.name.localeCompare(b.name))
          .forEach((f) => images.push({ file: f }));
      }
      if (missing.length) errors.push(`Photo not selected: ${missing.join(', ')}`);
      if (!images.length && !existingSkus.has(p.sku)) warnings.push('No photos');

      const seoDesc = !p.description && autoSeo && p.title && p.category;
      if (seoDesc) p.description = seoDescription(p);
      else if (p.description && p.description.length < 80) warnings.push('Short description (aim for 2-4 sentences)');

      return { row: i + 2, p, images, errors, warnings, seoDesc, isUpdate: existingSkus.has(p.sku) };
    });
  }, [rows, fileIndex, files, autoSeo, existingSkus, categoryNames]);

  const errorCount = plan.filter((x) => x.errors.length).length;
  const photoCount = new Set(plan.flatMap((x) => x.images.filter((i) => i.file).map((i) => i.file))).size;

  // ---------- Import ----------
  const runImport = async () => {
    if (!plan.length || errorCount) return;
    if (removeMissing && !window.confirm(`This permanently deletes every product whose SKU is not in "${sheetName}". Continue?`)) return;
    setBusy(true);
    setReport(null);
    try {
      // 1. New series
      const newSeries = [...new Set(plan.map((x) => x.p.series).filter((s) => s && !seriesList.includes(s)))];
      for (const name of newSeries) {
        await fetch(`${API_BASE_URL}/api/series`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ name }) });
      }

      // 2. Photos (each file once, 4 at a time)
      const uploaded = new Map();
      const failed = [];
      const jobs = [];
      plan.forEach((x) => x.images.forEach((img, n) => {
        if (img.file && !uploaded.has(img.file) && !jobs.some((j) => j.file === img.file)) {
          jobs.push({ file: img.file, publicId: `${slugify(x.p.title).slice(0, 60)}-${n + 1}-${Math.random().toString(36).slice(2, 6)}` });
        }
      }));
      let done = 0;
      const worker = async () => {
        while (jobs.length) {
          const job = jobs.shift();
          try { uploaded.set(job.file, await uploadImage(job.file, job.publicId)); } catch (e) { failed.push(`${job.file.name}: ${e.message}`); }
          done += 1;
          setProgress(`Uploading photos ${done}/${photoCount}`);
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);

      // 3. Products: blank cells are left out so they don't wipe existing data
      const payload = plan.map(({ p, images }) => {
        const urls = images.map((i) => i.url || uploaded.get(i.file)).filter(Boolean);
        const out = { sku: p.sku, title: p.title, category: p.category, isBestseller: p.isBestseller, isNewArrival: p.isNewArrival,
          wholesalePrice: p.wholesalePrice, mrp: p.mrp, moq: p.moq || 'On request' };
        ['series', 'designName', 'designNo', 'description', 'badge'].forEach((k) => { if (p[k]) out[k] = p[k]; });
        Object.entries(p.specs).forEach(([k, v]) => { if (v) out[`specs.${k}`] = v; });
        if (urls.length) out.images = urls;
        return out;
      });
      setProgress('Saving products…');
      const res = await fetch(`${API_BASE_URL}/api/admin/products/import`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ products: payload, removeMissing }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Import failed (${res.status})`);

      // 4. Rebuild the public site so new product pages + sitemap go live for Google
      setProgress('Updating sitemap and product pages…');
      const rebuild = await fetch(`${API_BASE_URL}/api/admin/rebuild-site`, { method: 'POST', headers: getAuthHeaders() })
        .then((r) => r.json()).catch(() => ({ triggered: false }));

      setReport({ ...data, photos: uploaded.size, failed, rebuilt: rebuild.triggered });
      setToast({ message: `Imported ${payload.length} products`, type: 'success' });
      onDone?.();
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Import failed', type: 'error' });
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  const btn = 'px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-serif text-xl font-bold text-stone-900">Bulk upload products & photos</h2>
        <ol className="text-sm text-stone-600 space-y-1 list-decimal pl-5">
          <li>Download the sample sheet (or the current catalogue to edit existing products).</li>
          <li>Fill one row per product in Excel or Google Sheets, then save as .xlsx or .csv.</li>
          <li>Choose the sheet and select all product photos in one go.</li>
          <li>Check the preview, then import. Same SKU = product is updated, new SKU = product is added.</li>
        </ol>
        <div className="flex flex-wrap gap-3">
          <button onClick={downloadSample} className={`${btn} bg-stone-900 text-white hover:bg-[#C5A059]`}>⬇ Download sample sheet</button>
          <button onClick={downloadCurrent} disabled={!products.length} className={`${btn} bg-white border border-stone-300 text-stone-800 hover:border-[#C5A059]`}>⬇ Download current catalogue ({products.length})</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="bg-white rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#C5A059] p-6 cursor-pointer block">
          <span className="block font-semibold text-stone-900 text-sm">1. Product sheet (.xlsx / .csv)</span>
          <span className="block text-xs text-stone-500 mt-1">{sheetName ? `${sheetName}: ${rows.length} rows` : 'Click to choose'}</span>
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files[0] && readSheet(e.target.files[0])} />
        </label>
        <label className="bg-white rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#C5A059] p-6 cursor-pointer block">
          <span className="block font-semibold text-stone-900 text-sm">2. All product photos</span>
          <span className="block text-xs text-stone-500 mt-1">{files.length ? `${files.length} photos selected (${photoCount} used by the sheet)` : 'Click and select all photos (Ctrl + A)'}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => setFiles([...e.target.files])} />
        </label>
      </div>

      {plan.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <strong className="text-stone-900">{plan.length} products</strong>
            <span className="text-emerald-700">{plan.filter((x) => !x.isUpdate).length} new</span>
            <span className="text-sky-700">{plan.filter((x) => x.isUpdate).length} updates</span>
            <span className={errorCount ? 'text-red-600 font-semibold' : 'text-stone-500'}>{errorCount} with errors</span>
            <span className="text-stone-500">{photoCount} photos to upload</span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-stone-700">
            <label className="flex items-center gap-2"><input type="checkbox" checked={autoSeo} onChange={(e) => setAutoSeo(e.target.checked)} /> Write SEO description when the cell is blank</label>
            <label className="flex items-center gap-2 text-red-700"><input type="checkbox" checked={removeMissing} onChange={(e) => setRemoveMissing(e.target.checked)} /> Delete products that are not in this sheet</label>
          </div>
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-stone-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-stone-50 sticky top-0 text-left text-stone-500 uppercase tracking-wider">
                <tr><th className="p-2">Row</th><th className="p-2">SKU</th><th className="p-2">Title / category</th><th className="p-2">Photos</th><th className="p-2">Status</th></tr>
              </thead>
              <tbody>
                {plan.map((x) => (
                  <tr key={x.row} className={`border-t border-stone-100 align-top ${x.errors.length ? 'bg-red-50' : ''}`}>
                    <td className="p-2 text-stone-400">{x.row}</td>
                    <td className="p-2 font-mono">{x.p.sku}</td>
                    <td className="p-2">
                      <div className="font-semibold text-stone-900">{x.p.title}</div>
                      <div className="text-stone-500">{x.p.category}{x.p.series ? ` · ${x.p.series}` : ''}</div>
                      {x.seoDesc && <div className="text-[11px] text-sky-700 mt-1">SEO description: {x.p.description}</div>}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {x.images.slice(0, 4).map((img, n) => (
                          <img key={n} src={img.url || thumbs.get(img.file)} alt="" className="w-10 h-10 object-cover rounded border border-stone-200" />
                        ))}
                        {x.images.length > 4 && <span className="text-stone-400">+{x.images.length - 4}</span>}
                        {!x.images.length && <span className="text-stone-400">{x.isUpdate ? 'keep current' : '—'}</span>}
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={x.isUpdate ? 'text-sky-700' : 'text-emerald-700'}>{x.isUpdate ? 'Update' : 'New'}</span>
                      {x.errors.map((e) => <div key={e} className="text-red-600">✕ {e}</div>)}
                      {x.warnings.map((w) => <div key={w} className="text-amber-600">! {w}</div>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={runImport} disabled={busy || errorCount > 0} className={`${btn} bg-[#C5A059] text-white hover:bg-stone-900`}>
              {busy ? progress || 'Working…' : `Import ${plan.length} products`}
            </button>
            {errorCount > 0 && <span className="text-xs text-red-600">Fix the red rows in your sheet and choose it again.</span>}
          </div>
        </div>
      )}

      {report && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-sm text-emerald-900 space-y-1">
          <strong>Import finished.</strong>
          <div>{report.upserted} added · {report.updated} updated · {report.removed} removed · {report.photos} photos uploaded · {report.total} products in catalogue</div>
          <div>{report.rebuilt ? 'Products and sitemap.xml are updated now. Website rebuild also started (about 2 minutes).' : 'Products and sitemap.xml are updated now (Google sees new products on its next sitemap visit).'}</div>
          {report.failed.length > 0 && <div className="text-red-700">Photos that failed: {report.failed.join('; ')}</div>}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;

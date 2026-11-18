// Post-build: writes dist/<route>/index.html for each public route and each catalogue product, with its own
// <head> tags, JSON-LD and readable text, so crawlers that skip JavaScript (GPTBot, PerplexityBot, etc.) see
// real content. Also writes dist/sitemap.xml (with image entries). React's createRoot replaces #root on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, SITE, businessSchema, faqSchema, productHead, productSchema } from '../src/seo/pages.js';
import { productPath } from '../src/utils/slug.js';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const products = JSON.parse(readFileSync(new URL('./catalogue-products.json', import.meta.url), 'utf8'));
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const abs = (src) => (src.startsWith('http') ? src : `${SITE}${src}`);

const writePage = (path, { title, description, image }, schemas, body) => {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    image ? `<meta property="og:image" content="${esc(image)}" />` : '',
    ...schemas.map(ld),
  ].filter(Boolean).join('\n    ');

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '');
  if (image) html = html.replace(/<meta property="og:image"[^>]*>/, '');
  html = html
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div style="max-width:960px;margin:40px auto;padding:0 16px;font-family:sans-serif">${body}</div></div>`);

  const outDir = path === '/' ? dist : join(dist, path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
};

const byCategory = products.reduce((acc, p) => ((acc[p.category] ||= []).push(p), acc), {});
const catalogueLinks = Object.entries(byCategory)
  .map(([cat, list]) => `<h2>${esc(cat)}</h2><ul>${list.map((p) => `<li><a href="${productPath(p)}">${esc(p.title)}</a></li>`).join('')}</ul>`)
  .join('\n');

for (const [path, page] of Object.entries(PAGES)) {
  const body = path === '/collections' ? `${page.body}\n${catalogueLinks}` : page.body;
  writePage(path, page, [businessSchema(), page.faq ? faqSchema() : null].filter(Boolean), body);
}
console.log(`seo: ${Object.keys(PAGES).length} pages`);

for (const p of products) {
  const path = productPath(p);
  const specs = Object.entries(p.specs || {}).filter(([, v]) => v).map(([k, v]) => `<li>${esc(k)}: ${esc(v)}</li>`).join('');
  const body = `<p><a href="/">Home</a> / <a href="/collections">Catalogue</a> / ${esc(p.category)}</p>
<h1>${esc(p.title)}</h1>
<p>${esc(p.category)} · ${esc(p.series)}${p.designNo ? ` · Design no. ${esc(p.designNo)}` : ''} · SKU ${esc(p.sku)}</p>
${(p.images || []).map((src, i) => `<img src="${esc(src)}" alt="${esc(p.title)}${i ? ` photo ${i + 1}` : ''}" width="480" loading="lazy" />`).join('\n')}
<p>${esc(p.description)}</p>
${specs ? `<ul>${specs}</ul>` : ''}
<p>Trade price and MOQ on request. WhatsApp +91 84594 95594 or visit our showroom at Karol Bagh, New Delhi.</p>`;
  writePage(path, productHead(p, path), [productSchema(p, path)], body);
}
console.log(`seo: ${products.length} product pages`);

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...Object.keys(PAGES).map((p) => ({ loc: `${SITE}${p === '/' ? '/' : p}`, images: [] })),
  ...products.map((p) => ({ loc: `${SITE}${productPath(p)}`, images: (p.images || []).map(abs) })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${today}</lastmod>${u.images.map((i) => `<image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('')}</url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
console.log(`seo: sitemap.xml written (${urls.length} urls)`);

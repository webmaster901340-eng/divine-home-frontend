// Post-build: writes dist/<route>/index.html for each public route and each catalogue product, with its own
// <head> tags, JSON-LD and readable text, so crawlers that skip JavaScript (GPTBot, PerplexityBot, etc.) see
// real content. Also writes dist/sitemap.xml (with image entries). React's createRoot replaces #root on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, SITE, businessSchema, faqSchema, productHead, productSchema, blogPostSchema } from '../src/seo/pages.js';
import { POSTS, postPath } from '../src/blog/posts.js';
import { img, srcSet } from '../src/utils/img.js';
import { productPath } from '../src/utils/slug.js';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
// Products come from the live API (what the CMS bulk upload writes); the JSON file is the offline fallback.
const API = process.env.VITE_API_BASE_URL || 'https://divine-home-backend.onrender.com';
const loadProducts = async () => {
  try {
    const res = await fetch(`${API}/api/products`, { signal: AbortSignal.timeout(90000) }); // Render may cold-start
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      console.log(`seo: ${data.length} products from API`);
      return data;
    }
    throw new Error('empty product list');
  } catch (err) {
    console.warn(`seo: API unavailable (${err.message}), using scripts/catalogue-products.json`);
    return JSON.parse(readFileSync(new URL('./catalogue-products.json', import.meta.url), 'utf8'));
  }
};
const seen = new Set();
const products = (await loadProducts()).filter((p) => {
  const path = productPath(p);
  if (!p.title || !p.category || seen.has(path)) return false; // two products with the same title share one URL
  seen.add(path);
  return true;
});
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const abs = (src) => (src.startsWith('http') ? src : `${SITE}${src}`);

const writePage = (path, { title, description, image, preload }, schemas, body) => {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    image ? `<meta property="og:image" content="${esc(image)}" />` : '',
    // LCP image (blog cover) discoverable straight from the HTML
    preload ? `<link rel="preload" as="image" href="${esc(preload.href)}"${preload.srcset ? ` imagesrcset="${esc(preload.srcset)}" imagesizes="${esc(preload.sizes)}"` : ''} fetchpriority="high" />` : '',
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

const blogLinks = `<ul>${POSTS.map((p) => `<li><a href="${postPath(p)}">${esc(p.title)}</a>: ${esc(p.excerpt)}</li>`).join('')}</ul>`;
const extraBody = { '/collections': catalogueLinks, '/blog': blogLinks, '/': `<h2>Guides for tray buyers</h2>${blogLinks}` };

for (const [path, page] of Object.entries(PAGES)) {
  const body = extraBody[path] ? `${page.body}\n${extraBody[path]}` : page.body;
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

for (const post of POSTS) {
  const path = postPath(post);
  const faq = (post.faq || []).map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('');
  const body = `<p><a href="/">Home</a> / <a href="/blog">Blog</a> / ${esc(post.category)}</p>
<h1>${esc(post.title)}</h1>
<p>By the Divine Home India team · ${esc(post.date)}</p>
<img src="${esc(post.cover)}" alt="${esc(post.coverAlt)}" width="960" />
${post.body}
${faq ? `<h2>Frequently asked questions</h2>${faq}` : ''}`;
  const preload = { href: img(post.cover, 960), srcset: srcSet(post.cover, [480, 960, 1600]), sizes: '(min-width: 1024px) 1024px, 100vw' };
  writePage(path, { title: post.metaTitle || post.title, description: post.description, image: abs(post.cover), preload }, [blogPostSchema(post, path)], body);
}
console.log(`seo: ${POSTS.length} blog posts`);

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...Object.keys(PAGES).map((p) => ({ loc: `${SITE}${p === '/' ? '/' : p}`, images: [] })),
  ...POSTS.map((p) => ({ loc: `${SITE}${postPath(p)}`, images: [abs(p.cover)] })),
  ...products.map((p) => ({ loc: `${SITE}${productPath(p)}`, images: (p.images || []).map(abs) })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${today}</lastmod>${u.images.map((i) => `<image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('')}</url>`).join('\n')}
</urlset>
`;
// /sitemap.xml itself is served live from the backend (vercel.json rewrite); this build-time copy is a backup.
writeFileSync(join(dist, 'sitemap-static.xml'), sitemap);
console.log(`seo: sitemap-static.xml written (${urls.length} urls)`);

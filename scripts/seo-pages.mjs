// Post-build: writes dist/<route>/index.html for each public route with its own <head> tags,
// JSON-LD and readable text, so crawlers that skip JavaScript (GPTBot, PerplexityBot, etc.) see real content.
// Also writes dist/sitemap.xml. React's createRoot replaces the static #root content on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, SITE, businessSchema, faqSchema } from '../src/seo/pages.js';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

for (const [path, page] of Object.entries(PAGES)) {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    ld(businessSchema()),
    page.faq ? ld(faqSchema()) : '',
  ].join('\n    ');

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div style="max-width:960px;margin:40px auto;padding:0 16px;font-family:sans-serif">${page.body}</div></div>`);

  const outDir = path === '/' ? dist : join(dist, path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`seo: ${path} -> ${join(outDir, 'index.html')}`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(PAGES).map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
console.log('seo: sitemap.xml written');

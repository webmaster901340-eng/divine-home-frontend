// Readable product URLs: /product/elegant-vector-tray-collection-ellite-series-5001
// Shared by the app and scripts/seo-pages.mjs so static pages and links always match.
export const slugify = (text = '') =>
  String(text).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const productSlug = (product) => slugify(product?.title) || String(product?._id || '');

export const productPath = (product) => `/product/${productSlug(product)}`;

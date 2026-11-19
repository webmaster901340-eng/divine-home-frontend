// Serve right-sized WebP copies of site photos instead of the 1200–1800px JPEGs.
// Local files: /images/<dir>/<name>.jpg -> /images/<dir>/w/<name>-<w>.webp (made by scripts/make_webp.py).
// Cloudinary (CMS uploads): add f_auto,q_auto,w_<w>. Anything else is returned unchanged.
const LOCAL = /^(?:https?:\/\/(?:www\.)?divinehomeindia\.com)?(\/images\/(?:.+\/)?)([^/]+)\.(?:jpe?g|png)$/i;
const WIDTHS = [240, 480, 960, 1600];

export function img(url, w = 960) {
  if (!url || typeof url !== 'string') return url;
  const m = url.match(LOCAL);
  if (m && !m[1].includes('/w/')) {
    const wide = /\/images\/(site|hero)\/$/.test(m[1]);
    const size = WIDTHS.find((x) => x >= w) || 1600;
    if (size === 1600 && !wide) return url; // 1200px product photos: original is the largest copy
    return `${m[1]}w/${m[2]}-${size}.webp`;
  }
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !/\/upload\/[^/]*w_\d+/.test(url)) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);
  }
  return url;
}

export function srcSet(url, widths = [480, 960]) {
  if (!url || img(url, widths[0]) === url) return undefined;
  return widths.map((w) => `${img(url, w)} ${w}w`).join(', ');
}

// If a WebP copy is missing (e.g. a brand-new upload), fall back to the original once.
export function onImgError(original) {
  return (e) => {
    const el = e.currentTarget;
    if (original && el.dataset.fallback !== '1') {
      el.dataset.fallback = '1';
      el.removeAttribute('srcset');
      el.src = original;
    }
  };
}

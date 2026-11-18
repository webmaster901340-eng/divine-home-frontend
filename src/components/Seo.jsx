import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGES, SITE } from '../seo/pages';

const setMeta = (selector, attr, key, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value);
};

// Replaces (or removes, when data is null) one JSON-LD block identified by `id`.
export const setJsonLd = (id, data) => {
  document.getElementById(id)?.remove();
  if (!data) return;
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.id = id;
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
};

// Title, description, canonical and Open Graph tags for one URL path.
export const applyHead = ({ path, title, description, image }) => {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  document.title = title;
  setMeta('meta[name="description"]', 'name', 'description', description);
  setMeta('link[rel="canonical"]', 'rel', 'canonical', url);
  setMeta('meta[property="og:title"]', 'property', 'og:title', title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', url);
  setMeta('meta[property="og:image"]', 'property', 'og:image', image || `${SITE}/images/dhi/showroom-tray-shelves.jpg`);
};

// Keeps the head in sync for the fixed pages. Product pages set their own head in ProductDetails.
const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith('/product/')) setJsonLd('product-ld', null);
    const page = PAGES[pathname];
    if (!page) return;
    applyHead({ path: pathname, title: page.title, description: page.description, image: page.image });
  }, [pathname]);

  return null;
};

export default Seo;

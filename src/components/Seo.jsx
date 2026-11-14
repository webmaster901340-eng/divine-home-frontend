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

// Keeps title, description, canonical and Open Graph tags in sync with the current route.
const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGES[pathname];
    if (!page) return; // product pages and admin keep the default head
    const url = `${SITE}${pathname === '/' ? '/' : pathname}`;
    document.title = page.title;
    setMeta('meta[name="description"]', 'name', 'description', page.description);
    setMeta('link[rel="canonical"]', 'rel', 'canonical', url);
    setMeta('meta[property="og:title"]', 'property', 'og:title', page.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', page.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
  }, [pathname]);

  return null;
};

export default Seo;

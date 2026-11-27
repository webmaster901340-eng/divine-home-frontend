// GA4 lead tracking. The gtag snippet itself lives in index.html (so Google can detect the tag);
// page views on route changes come from GA4 enhanced measurement (browser history events).
// Here we only add the business events that matter: WhatsApp / phone / email clicks and enquiry forms.
const track = (name, params = {}) => {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
};

export function initAnalytics() {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const where = { page_path: window.location.pathname, link_text: (a.textContent || '').trim().slice(0, 60) };
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)/.test(href)) track('whatsapp_click', where);
    else if (href.startsWith('tel:')) track('phone_click', where);
    else if (href.startsWith('mailto:')) track('email_click', where);
  }, { capture: true });

  // Enquiry forms (RFQ, wholesale, contact, cart quote, newsletter). Skips admin and the site search box.
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (window.location.pathname.startsWith('/admin') || form.closest('nav, header') || form.querySelector('input[type="search"]')) return;
    const heading = form.closest('section, div[role="dialog"], .fixed')?.querySelector('h1, h2, h3')?.textContent?.trim();
    track('generate_lead', { page_path: window.location.pathname, form_name: (form.id || heading || 'form').slice(0, 60) });
  }, { capture: true });
}

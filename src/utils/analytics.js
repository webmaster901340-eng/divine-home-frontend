// Lead tracking for GA4 (gtag) and the Meta Pixel (fbq). Both base snippets live in index.html so the
// platforms can detect them. GA4 page views on route changes come from enhanced measurement; the Meta
// Pixel needs an explicit PageView per SPA route change (trackPageView, called from <Seo />).
// Business events: WhatsApp / phone / email clicks (GA4 *_click, Meta Contact) and enquiry forms
// (GA4 generate_lead, Meta Lead).
const ga = (name, params = {}) => {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
};
const meta = (name, params = {}) => {
  if (typeof window.fbq === 'function') window.fbq('track', name, params);
};

let firstView = true;
export function trackPageView() {
  if (firstView) { firstView = false; return; } // the index.html snippet already sent the landing page view
  if (!window.location.pathname.startsWith('/admin') && typeof window.fbq === 'function') window.fbq('track', 'PageView');
}

export function initAnalytics() {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const where = { page_path: window.location.pathname, link_text: (a.textContent || '').trim().slice(0, 60) };
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)/.test(href)) { ga('whatsapp_click', where); meta('Contact', { method: 'whatsapp' }); }
    else if (href.startsWith('tel:')) { ga('phone_click', where); meta('Contact', { method: 'phone' }); }
    else if (href.startsWith('mailto:')) { ga('email_click', where); meta('Contact', { method: 'email' }); }
  }, { capture: true });

  // Enquiry forms (RFQ, wholesale, contact, cart quote, newsletter). Skips admin and the site search box.
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (window.location.pathname.startsWith('/admin') || form.closest('nav, header') || form.querySelector('input[type="search"]')) return;
    const heading = form.closest('section, div[role="dialog"], .fixed')?.querySelector('h1, h2, h3')?.textContent?.trim();
    const formName = (form.id || heading || 'form').slice(0, 60);
    ga('generate_lead', { page_path: window.location.pathname, form_name: formName });
    meta('Lead', { content_name: formName });
  }, { capture: true });
}

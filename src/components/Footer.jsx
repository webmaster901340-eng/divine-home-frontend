import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/api';
import { Link } from 'react-router-dom';
import RFQModal from './RFQModal';

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const Icon = ({ d, className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const PIN = 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';
const PHONE = 'M5 4h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3L14 12.5l4 1.5v3a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2z';
const MAIL = 'M4 6h16v12H4zM4 7l8 6 8-6';
const IG = 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01';
const WA = 'M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 0 1-2.3-2.3l.8-1-1-2z';

const LINES = [
  ['Decorative Tray Sets', '/collections?category=Trays+%26+Serving+Platters'],
  ['Mango Wood Trays', '/collections?category=Artisan+Trays+%26+Platters'],
  ['Leatherette Organisers', '/collections?category=Organizers+%26+Holders'],
  ['Snack & Candy Sets', '/collections?category=Tableware+%26+Dining'],
  ['Crockery & Mugs', '/collections?category=Crockery'],
];
const POLICIES = [
  ['Dealer Registration', '/policy/dealer-registration'],
  ['Shipping & Delivery', '/policy/shipping-policy'],
  ['Wholesale Terms', '/policy/wholesale-terms'],
  ['Privacy Policy', '/policy/privacy-policy'],
];

const Footer = () => {
  const [isRFQOpen, setIsRFQOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [note, setNote] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNote('Please enter a valid business email.');
      return;
    }
    setSubscribing(true);
    setNote('');
    const leadPayload = {
      name: 'B2B Newsletter Subscriber',
      company: 'Dealer Network',
      phone: 'N/A',
      email: newsletterEmail,
      quantity: 'Quarterly Catalog & Rate Sheet',
      city: 'Pan-India',
      instructions: 'Subscribed via Footer B2B Network Callout',
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setNote('Thank you. Our team will share the latest price list shortly.');
        setNewsletterEmail('');
      } else {
        setNote(data.error || 'Could not subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setNote('Could not connect. Please try again or WhatsApp us.');
    } finally {
      setSubscribing(false);
    }
  };

  const linkCls = 'text-stone-300 hover:text-[#C5A059] transition-colors';
  const headCls = 'text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-3 sm:mb-4';

  return (
    <>
      <footer className="w-full bg-[#0c0a09] text-stone-300 pt-10 sm:pt-14 pb-24 sm:pb-10 border-t border-stone-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Price list sign-up */}
          <div className="pb-8 mb-8 sm:pb-12 sm:mb-12 border-b border-stone-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <h3 className="font-serif text-xl sm:text-3xl text-white tracking-tight">Get the trade price list</h3>
              <p className="text-[13px] text-stone-400 mt-1.5 max-w-xl">New tray designs, festive catalogue previews and updated dealer prices.</p>
            </div>
            <div className="w-full lg:w-auto">
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">Business email</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Business email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="min-w-0 flex-1 lg:w-72 bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="shrink-0 bg-[#C5A059] hover:bg-[#b08d4c] text-stone-950 font-semibold px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {subscribing ? 'Sending…' : 'Subscribe'}
                </button>
              </form>
              {note && <p className="text-xs text-stone-400 mt-2" role="status">{note}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-9 pb-8 sm:pb-10 border-b border-stone-800/80">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-4">
              <img src="/logo-footer.png" alt="Divine Home India" width="517" height="212" loading="lazy" className="h-14 sm:h-16 w-auto object-contain" />
              <p className="text-[13px] text-stone-400 mt-3 max-w-xs leading-relaxed">
                Decorative trays, organisers and ceramics, designed in-house in Karol Bagh since 2015. Supplying dealers across India.
              </p>
              <div className="flex gap-2.5 mt-4">
                <a href="https://www.instagram.com/divinehomeindia" target="_blank" rel="noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-stone-200 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">
                  <Icon d={IG} />
                </a>
                <a href="https://wa.me/918459495594" target="_blank" rel="noreferrer" aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-stone-200 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">
                  <Icon d={WA} />
                </a>
                <a href="tel:+918459495594" aria-label="Call"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-stone-200 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">
                  <Icon d={PHONE} />
                </a>
              </div>
            </div>

            {/* Wholesale lines */}
            <div className="lg:col-span-2">
              <h4 className={headCls}>Wholesale</h4>
              <ul className="space-y-0.5 text-[13px] sm:text-sm">
                {LINES.map(([label, to]) => (
                  <li key={to}><Link to={to} onClick={toTop} className={linkCls}>{label}</Link></li>
                ))}
                <li><Link to="/collections" onClick={toTop} className="text-[#C5A059] hover:underline">View all →</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div className="lg:col-span-2">
              <h4 className={headCls}>Dealers</h4>
              <ul className="space-y-0.5 text-[13px] sm:text-sm">
                {POLICIES.map(([label, to]) => (
                  <li key={to}><Link to={to} className={linkCls}>{label}</Link></li>
                ))}
                <li>
                  <button type="button" onClick={() => setIsRFQOpen(true)} className="text-[#C5A059] hover:underline py-[7px]">
                    Price sheet →
                  </button>
                </li>
              </ul>
            </div>

            {/* Showroom */}
            <div className="col-span-2 lg:col-span-4">
              <h4 className={headCls}>Showroom</h4>
              <div className="space-y-2.5 text-[13px] sm:text-sm text-stone-300">
                <a href="https://maps.google.com/?q=Divine+Home+India+Karol+Bagh" target="_blank" rel="noreferrer" className="flex items-start gap-2.5 hover:text-white">
                  <Icon d={PIN} className="w-4 h-4 mt-0.5 shrink-0 text-[#C5A059]" />
                  <span>1st Floor, 15A/47, near Hotel Kyron, WEA, Karol Bagh, New Delhi 110005</span>
                </a>
                <a href="tel:+918459495594" className="flex items-center gap-2.5 hover:text-white">
                  <Icon d={PHONE} className="w-4 h-4 shrink-0 text-[#C5A059]" />+91 84594 95594
                </a>
                <a href="mailto:wholesale@divinehomeindia.com" className="flex items-center gap-2.5 hover:text-white break-all">
                  <Icon d={MAIL} className="w-4 h-4 shrink-0 text-[#C5A059]" />wholesale@divinehomeindia.com
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500 text-center">
            <p>© {new Date().getFullYear()} Divine Home India. All rights reserved.</p>
            <p className="flex items-center gap-3">
              <span>Pan-India dispatch from New Delhi</span>
              <Link to="/admin/login" className="text-stone-700 hover:text-[#C5A059] transition-colors font-bold select-none" title="Admin" aria-label="Admin login">·</Link>
            </p>
          </div>
        </div>
      </footer>

      <RFQModal isOpen={isRFQOpen} onClose={() => setIsRFQOpen(false)} productTitle="Master Price Sheet & Catalog" />
    </>
  );
};

Footer.displayName = 'Footer';
export default Footer;

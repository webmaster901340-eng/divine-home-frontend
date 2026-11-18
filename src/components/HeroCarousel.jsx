import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Homepage hero slider. Slides come from Admin → Hero Banners (title, subtitle, image, ctaLabel, ctaLink);
// DEFAULT_SLIDES is used until the CMS has any. Desktop: photo full-bleed with text on a dark gradient.
// Mobile: photo on top, text below, so landscape product photos are never cropped into a sliver.
export const DEFAULT_SLIDES = [
  {
    title: 'Tray sets your customers come back for',
    subtitle: 'Ellite Series trays, candy boxes and coasters in one matching design. Designed in-house, supplied to gift shops and decor stores across India.',
    image: '/images/hero/elegant-vector-tray-set-lifestyle.jpg',
    alt: 'Elegant Vector decorative tray set with candy box and coasters in a living room',
    ctaLabel: 'See the Ellite Series',
    ctaLink: '/collections?series=Ellite%20Series',
  },
  {
    title: 'Festive and wedding gifting, ready to stock',
    subtitle: 'Lotus Glow, Peacock Grace and Bless Heart sets that sell through Diwali and the wedding season. Order early, we dispatch across India.',
    image: '/images/hero/lotus-glow-tray-set-festive.jpg',
    alt: 'Lotus Glow tray collection styled for a festive evening',
    ctaLabel: 'View festive range',
    ctaLink: '/collections',
  },
  {
    title: 'Serveware that sells itself on the shelf',
    subtitle: 'Ceramic snack sets on gold stands, revolving snack sets and candy sets in gift boxes. Strong gifting picks for every season.',
    image: '/images/hero/revolving-snack-set-gold.jpg',
    alt: 'Ceramic snack jar sets on gold revolving stands',
    ctaLabel: 'Snack & candy sets',
    ctaLink: '/collections?category=Tableware%20%26%20Dining',
  },
  {
    title: 'Crockery that matches the trays',
    subtitle: 'Tea sets, plates and cups in our Elegant Vector and Peachy Bloom designs, so your customers can buy the complete look.',
    image: '/images/hero/elegant-vector-crockery-set.jpg',
    alt: 'Elegant Vector gold-rim crockery and tea set',
    ctaLabel: 'View crockery',
    ctaLink: '/collections?category=Crockery',
  },
  {
    title: 'Corporate gifts with your logo on the box',
    subtitle: 'Tray and serveware gift sets for clients and teams, with custom branding. Allow 5 to 6 weeks for branded orders.',
    image: '/images/hero/bless-heart-tray-collection.jpg',
    alt: 'Bless Heart tray collection with gold accents on marble',
    ctaLabel: 'Plan corporate gifts',
    ctaLink: '/wholesale',
  },
];

const INTERVAL = 6000;

const CtaLink = ({ to, className, children }) =>
  /^https?:\/\//.test(to)
    ? <a href={to} className={className} target="_blank" rel="noreferrer">{children}</a>
    : <Link to={to || '/collections'} className={className}>{children}</Link>;

const HeroCarousel = ({ banners = [] }) => {
  const slides = (banners.length ? banners : DEFAULT_SLIDES).filter((s) => s.image);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const count = slides.length;

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => { setIndex(0); }, [count]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce || count < 2) return undefined;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, count, go]);

  if (!count) return null;

  return (
    <section
      className="relative bg-[#F4EFE7] text-stone-900 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {/* Split layout: photo is shown near its native size (never stretched full-bleed), so it stays sharp */}
      <div className="relative md:h-[70vh] md:min-h-[520px] md:max-h-[720px]">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s._id || s.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className={`md:grid md:grid-cols-12 transition-opacity duration-700 ease-out ${active ? 'opacity-100 relative md:absolute md:inset-0 z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'}`}
            >
              <div className="relative aspect-[16/10] md:aspect-auto md:order-2 md:col-span-7 md:h-full overflow-hidden bg-[#E9E2D6]">
                <img
                  src={s.image}
                  alt={s.alt || s.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:order-1 md:col-span-5 flex items-center">
                <div className="w-full px-4 sm:px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12 py-8 md:py-0">
                  <div className={`max-w-lg transition-all duration-700 delay-150 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                    <h2 className="font-serif text-[30px] leading-[1.12] sm:text-4xl lg:text-[50px] lg:leading-[1.08] text-stone-900">
                      {s.title}
                    </h2>
                    {s.subtitle && (
                      <p className="mt-4 text-[15px] sm:text-base text-stone-600 leading-relaxed">{s.subtitle}</p>
                    )}
                    <div className="mt-7 flex flex-wrap gap-3">
                      <CtaLink
                        to={s.ctaLink}
                        className="inline-flex items-center gap-2 bg-stone-900 hover:bg-[#3a2f24] text-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
                      >
                        {s.ctaLabel || 'View catalogue'} <span aria-hidden="true">&rarr;</span>
                      </CtaLink>
                      <Link
                        to="/wholesale"
                        className="inline-flex items-center px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em] border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors"
                      >
                        Get trade price list
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="relative z-20 md:absolute md:bottom-6 md:left-0 md:w-[41.666%] pb-6 md:pb-0">
          <div className="px-4 sm:px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] flex items-center gap-4">
            <div className="flex items-center gap-1">
              {slides.map((s, i) => (
                <button
                  key={s._id || s.image}
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}: ${s.title}`}
                  aria-current={i === index}
                  className="py-3 px-1 cursor-pointer"
                >
                  <span className={`block h-[3px] transition-all duration-300 ${i === index ? 'w-10 bg-stone-900' : 'w-5 bg-stone-900/25 hover:bg-stone-900/50'}`} />
                </button>
              ))}
            </div>
            <div className="ml-auto lg:mr-12 flex gap-2">
              <button onClick={() => go(index - 1)} aria-label="Previous slide" className="w-11 h-11 rounded-full border border-stone-900/30 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer">&larr;</button>
              <button onClick={() => go(index + 1)} aria-label="Next slide" className="w-11 h-11 rounded-full border border-stone-900/30 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer">&rarr;</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;

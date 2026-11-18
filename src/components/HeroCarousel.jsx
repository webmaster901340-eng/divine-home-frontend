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
      className="relative bg-[#211c17] text-white overflow-hidden"
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
      <div className="relative md:h-[78vh] md:min-h-[560px] md:max-h-[820px]">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s._id || s.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className={`transition-opacity duration-700 ease-out ${active ? 'opacity-100 relative md:absolute md:inset-0 z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'}`}
            >
              <div className="relative aspect-[16/10] md:aspect-auto md:absolute md:inset-0">
                <img
                  src={s.image}
                  alt={s.alt || s.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${active ? 'scale-105' : 'scale-100'}`}
                />
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#211c17]/90 via-[#211c17]/55 to-transparent" />
              </div>

              <div className="md:absolute md:inset-0 flex items-start md:items-center min-h-[300px] sm:min-h-[280px] md:min-h-0">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-0">
                  <div className={`max-w-xl transition-all duration-700 delay-150 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h2 className="font-serif text-[28px] leading-tight sm:text-4xl lg:text-[54px] lg:leading-[1.08] font-bold tracking-tight">
                      {s.title}
                    </h2>
                    {s.subtitle && (
                      <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed max-w-lg">{s.subtitle}</p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <CtaLink
                        to={s.ctaLink}
                        className="inline-flex items-center gap-2 bg-[#FBF9F5] hover:bg-white text-[#211c17] px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
                      >
                        {s.ctaLabel || 'View catalogue'} <span aria-hidden="true">&rarr;</span>
                      </CtaLink>
                      <Link
                        to="/wholesale"
                        className="inline-flex items-center px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em] border border-white/60 hover:border-white hover:bg-white/10 transition-colors"
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
        <div className="relative z-20 md:absolute md:bottom-6 md:left-0 md:right-0 pb-6 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s._id || s.image}
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}: ${s.title}`}
                  aria-current={i === index}
                  className="py-3 px-1 cursor-pointer"
                >
                  <span className={`block h-1 rounded-full transition-all duration-300 ${i === index ? 'w-10 bg-[#C5A059]' : 'w-5 bg-white/35 hover:bg-white/70'}`} />
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={() => go(index - 1)} aria-label="Previous slide" className="w-11 h-11 rounded-full border border-white/30 hover:bg-white hover:text-[#211c17] transition-colors cursor-pointer">&larr;</button>
              <button onClick={() => go(index + 1)} aria-label="Next slide" className="w-11 h-11 rounded-full border border-white/30 hover:bg-white hover:text-[#211c17] transition-colors cursor-pointer">&rarr;</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;

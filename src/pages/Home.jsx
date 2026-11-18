import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import InstagramReelsCarousel from '../components/InstagramReelsCarousel';
import HeroCarousel from '../components/HeroCarousel';
import { API_BASE_URL } from '../utils/api';
import { FAQ } from '../seo/pages';

const FadeIn = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0, rootMargin: '0px 0px 120px 0px' });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      if (direction === "up") return "translate-y-4 opacity-0";
      if (direction === "down") return "-translate-y-4 opacity-0";
      if (direction === "left") return "translate-x-4 opacity-0";
      if (direction === "right") return "-translate-x-4 opacity-0";
      if (direction === "zoom") return "scale-95 opacity-0";
    }
    return "translate-y-0 translate-x-0 scale-100 opacity-100";
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${Math.min(delay, 150)}ms` }}
      className={`transition-[opacity,transform] duration-500 ease-out ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [reels, setReels] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [pageImages, setPageImages] = useState({
    home_story: "/images/site/about-hero-2.jpg"
  });
  const [openFaq, setOpenFaq] = useState(null);

  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [rfqForm, setRfqForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    quantity: '',
    city: '',
    instructions: ''
  });
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [submittingRfq, setSubmittingRfq] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/hero-banners/active`)
      .then(res => res.json())
      .then(data => setHeroBanners(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to load banners', err));

    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products', err));

    fetch(`${API_BASE_URL}/api/reels`)
      .then(res => res.json())
      .then(data => setReels(data))
      .catch(err => console.error('Failed to load reels', err));

    const saved = localStorage.getItem('dhi_page_images');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPageImages(prev => ({...prev, ...data}));
      } catch (err) {
        // Silently fail if localStorage parsing fails
      }
    }
  }, []);

  const handleRfqChange = (e) => {
    setRfqForm({ ...rfqForm, [e.target.name]: e.target.value });
  };

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    setSubmittingRfq(true);

    const leadPayload = {
      name: rfqForm.name,
      company: rfqForm.company || 'Home Page RFQ Lead',
      phone: rfqForm.phone,
      email: rfqForm.email || 'N/A',
      quantity: rfqForm.quantity,
      city: rfqForm.city,
      instructions: rfqForm.instructions || 'Submitted via Home Page Hero RFQ Modal'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      const data = await response.json();

      if (response.ok) {
        setRfqSubmitted(true);
      } else {
        alert("Error submitting RFQ: " + (data.error || "Please try again"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Failed to connect to server. Make sure your backend server is running.");
    } finally {
      setSubmittingRfq(false);
    }
  };

  const categories = [
    { name: "Elegant Vector", designs: "10 Designs", image: "/images/d2c/dhi-5001-1.jpg" },
    { name: "Lotus Glow", designs: "5 Designs", image: "/images/d2c/dhi-5002-1.jpg" },
    { name: "Peachy Bloom", designs: "3 Designs", image: "/images/d2c/dhi-5003-1.jpg" },
    { name: "Peacock Grace", designs: "3 Designs", image: "/images/d2c/dhi-5004-1.jpg" },
    { name: "Ikket", designs: "2 Designs", image: "/images/d2c/dhi-5006-1.jpg" },
    { name: "Marble Flow", designs: "2 Designs", image: "/images/d2c/dhi-5007-1.jpg" },
    { name: "Leather Classic Black", designs: "3 Designs", image: "/images/d2c/dhi-lc-black-1.jpg" },
    { name: "Leather Classic Maroon", designs: "1 Design", image: "/images/d2c/dhi-lc-maroon-1.jpg" }
  ];

  const wholesaleLines = [
    { name: "Elegant Vector", designs: "10 DESIGNS", desc: "Gold star line-work on a white base with a hammered rim. Our most reordered tray design.", image: "/images/d2c/dhi-5001-1.jpg", series: "Ellite Series" },
    { name: "Lotus Glow", designs: "5 DESIGNS", desc: "Lotus motifs in soft gold. A steady seller for Diwali, weddings and housewarming gifts.", image: "/images/d2c/dhi-5002-1.jpg", series: "Ellite Series" },
    { name: "Peachy Bloom", designs: "3 DESIGNS", desc: "Peach florals on a light base. Works well in gift shops with a younger, urban crowd.", image: "/images/d2c/dhi-5003-1.jpg", series: "Ellite Series" },
    { name: "Peacock Grace", designs: "3 DESIGNS", desc: "Peacock artwork in jewel tones with gold detailing. A strong festive and gifting design.", image: "/images/d2c/dhi-5004-1.jpg", series: "Ellite Series" },
    { name: "Ikket", designs: "2 DESIGNS", desc: "Ikat-inspired weave pattern printed in bold colour, for buyers who want something traditional.", image: "/images/d2c/dhi-5006-1.jpg", series: "Ellite Series" },
    { name: "Marble Flow", designs: "2 DESIGNS", desc: "Marble-effect print with a gold rim. Pairs with modern dining and coffee-table setups.", image: "/images/d2c/dhi-5007-1.jpg", series: "Ellite Series" },
    { name: "Leather Classic Black", designs: "3 DESIGNS", desc: "Black leatherette trays and organisers for desks, vanities and hotel rooms.", image: "/images/d2c/dhi-lc-black-1.jpg", series: "Leather Classic" },
    { name: "Leather Classic Maroon", designs: "1 DESIGN", desc: "Maroon leatherette trays and organisers. Popular for corporate and wedding gifting.", image: "/images/d2c/dhi-lc-maroon-1.jpg", series: "Leather Classic" }
  ];

  const faqs = FAQ.slice(0, 4).map(([q, a]) => ({ q, a }));

  // Dynamic filtering based on admin badge tags
  const hasD2c = (p) => (p.images?.[0] || '').includes('/d2c/') ? 1 : 0;
  const bestsellers = products.filter(p => p.badge && p.badge.toUpperCase() === 'BESTSELLER').sort((a, b) => hasD2c(b) - hasD2c(a));
  const newArrivals = products.filter(p => p.badge && p.badge.toUpperCase() === 'NEW ARRIVAL');

  // Only show products with correct badges - no fallback
  const displayBestsellers = bestsellers;
  const displayNewArrivals = newArrivals;

  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-hidden">
      
      {/* 1. Hero slider (slides managed in Admin → Hero Banners) */}
      <HeroCarousel banners={heroBanners} />

      {/* 2. Stats Bar Section */}
      <FadeIn direction="zoom" delay={150}>
        <section className="bg-white border-b border-stone-200 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-serif text-2xl sm:text-[32px] text-stone-900">2015</p>
              <p className="text-xs uppercase tracking-[0.12em] text-stone-600 mt-1.5 font-medium">Supplying Since</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-[32px] text-stone-900">250+</p>
              <p className="text-xs uppercase tracking-[0.12em] text-stone-600 mt-1.5 font-medium">Dealers Across India</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-[32px] text-stone-900">Karol Bagh</p>
              <p className="text-xs uppercase tracking-[0.12em] text-stone-600 mt-1.5 font-medium">Delhi Showroom Hub</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-[32px] text-stone-900">50+</p>
              <p className="text-xs uppercase tracking-[0.12em] text-stone-600 mt-1.5 font-medium">Distributors</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 3. Explore By Category Section */}
      <section className="py-12 sm:py-16 bg-[#FDFBF7] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
                        <h1 className="font-serif text-[28px] sm:text-[44px] leading-[1.12] text-stone-900 mb-4 max-w-3xl mx-auto">
              Decorative Trays & Home Decor, Wholesale from Karol Bagh
            </h1>
            <p className="text-[15px] sm:text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              We design and supply printed trays, mango wood, ceramics and gift sets to shops, distributors and corporate buyers across India. Since 2015, from our showroom in Karol Bagh, New Delhi.
            </p>
            <Link to="/collections" className="inline-block text-sm font-semibold text-stone-900 mb-10 sm:mb-14 underline underline-offset-[6px] decoration-stone-400 hover:decoration-stone-900 transition-colors">
              View the full catalogue
            </Link>
          </FadeIn>

          <FadeIn direction="up" delay={200}>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 items-start">
              {categories.map((cat, index) => (
                <Link to={`/collections?category=${encodeURIComponent(cat.name)}`} key={index} className="group flex flex-col items-center cursor-pointer">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-white border border-stone-200 shadow-sm group-hover:border-[#C5A059] transition-all duration-300 mb-2.5 sm:mb-3">
                    <img src={cat.image} alt={`${cat.name} decorative tray set`} loading="lazy" className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-sans text-stone-900 font-medium text-[13px] sm:text-sm leading-tight mb-1 text-center line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-stone-500 font-sans">{cat.designs}</span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. New Wholesale Arrivals Section */}
      <FadeIn direction="right">
        <section className="py-16 sm:py-20 bg-white border-y border-stone-200 relative overflow-hidden">
          
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-stone-200">
              <div>
                <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900">
                  New Wholesale Arrivals
                </h2>
                <p className="text-[15px] text-stone-600 mt-3 max-w-xl">
                  The latest tray designs, serving sets and gift lines added to our wholesale range.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link 
                  to="/collections" 
                  className="text-sm font-semibold text-stone-900 underline underline-offset-[6px] decoration-stone-400 hover:decoration-stone-900 flex items-center gap-2 group"
                >
                  <span>View Full Catalog</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => document.getElementById('arrivals-slider').scrollBy({ left: -340, behavior: 'smooth' })}
                    className="w-11 h-11 rounded-full border border-stone-300 bg-white hover:bg-stone-900 hover:text-white flex items-center justify-center text-stone-700 transition-all shadow-md cursor-pointer"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={() => document.getElementById('arrivals-slider').scrollBy({ left: 340, behavior: 'smooth' })}
                    className="w-11 h-11 rounded-full border border-stone-300 bg-white hover:bg-stone-900 hover:text-white flex items-center justify-center text-stone-700 transition-all shadow-md cursor-pointer"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Slider Grid */}
            <div
              id="arrivals-slider"
              className="flex gap-6 overflow-x-auto pb-8 pt-3 px-2 scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayNewArrivals.length > 0 ? (
                displayNewArrivals.map(product => (
                  <div key={product._id} className="w-[68%] sm:w-[280px] lg:w-[300px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12 text-stone-400">
                  <p className="text-sm font-serif">No new arrivals available yet.</p>
                </div>
              )}
            </div>

          </div>
        </section>
      </FadeIn>

      {/* 5. Explore Our Wholesale Lines Section */}
      <section className="py-16 sm:py-24 bg-[#F4EFE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900">
                Shop by design
              </h2>
              <p className="text-[15px] text-stone-600 mt-3 leading-relaxed">
                Every print comes as a full matching set: trays, candy box, coasters and holders, so a shop shelf looks complete.
              </p>
            </div>
            <Link to="/collections" className="self-start sm:self-auto text-sm font-semibold text-stone-900 underline underline-offset-[6px] decoration-stone-400 hover:decoration-stone-900">
              View all designs
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
            {wholesaleLines.map((line, idx) => (
              <Link
                key={idx}
                to={`/collections?series=${encodeURIComponent(line.series)}&design=${encodeURIComponent(line.name)}`}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#E9E2D6]">
                  <img src={line.image} alt={`${line.name} tray collection`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
                    <h3 className="font-serif text-lg sm:text-[22px] text-stone-900 leading-tight">{line.name}</h3>
                    <span className="text-xs text-stone-500 shrink-0 capitalize">{line.designs.toLowerCase()}</span>
                  </div>
                  <p className="text-[13px] sm:text-sm text-stone-600 mt-1.5 leading-relaxed line-clamp-2">{line.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Wholesale Bestsellers Section */}
      <FadeIn direction="left">
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FDFBF7] to-stone-100/60 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900">
                  Our Wholesale Bestsellers
                </h2>
                <p className="text-[15px] text-stone-600 mt-3">
                  The tray sets, snack sets and organisers our dealers reorder most.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/collections" className="text-sm font-semibold text-stone-900 underline underline-offset-[6px] decoration-stone-400 hover:decoration-stone-900">
                  View all
                </Link>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => document.getElementById('bestsellers-slider').scrollBy({ left: -320, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-colors shadow-md cursor-pointer"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={() => document.getElementById('bestsellers-slider').scrollBy({ left: 320, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-colors shadow-md cursor-pointer"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div id="bestsellers-slider" className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {displayBestsellers.length > 0 ? (
                displayBestsellers.map(product => (
                  <div key={product._id} className="w-[68%] sm:w-[280px] lg:w-[300px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12 text-stone-400">
                  <p className="text-sm font-serif">No bestsellers available yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 7. Instagram Reels Section */}
      <FadeIn direction="up">
        <section className="py-16 sm:py-20 bg-[#FDFBF7] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900 mb-3">
                See the range on Instagram
              </h2>
              <p className="text-[15px] text-stone-600 max-w-xl mx-auto">
                New designs, showroom walk-throughs and how our sets look on a shop shelf.
              </p>
            </div>

            {reels && reels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {reels.map((reel) => (
                  <div key={reel._id} className="flex justify-center">
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative w-full max-w-[260px] h-[380px] rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-2 block bg-stone-900 border border-stone-200"
                    >
                      {reel.image ? (
                        <img
                          src={reel.image}
                          alt={reel.title}
                          className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                          <span className="text-4xl">📱</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                        <h3 className="font-serif text-sm font-bold text-white line-clamp-2 group-hover:text-[#7a5c25] transition-colors leading-snug">
                          {reel.title}
                        </h3>
                      </div>

                      <div className="absolute top-4 right-4 z-10">
                        <span className="w-10 h-10 rounded-full bg-[#E1306C] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <p className="text-stone-500 font-serif">No Instagram Reels available yet.</p>
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      {/* 8. Why Dealers & Retailers Partner With Us */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900">Why shops reorder from us</h2>
            <p className="text-[15px] text-stone-600 mt-4 leading-relaxed">Gift shops, decor stores and distributors across India restock with us season after season. Here is why.</p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-10">
            {[
              { num: "01", title: "Designs made in-house", desc: "We develop our own tray prints, so your shelf doesn't look like every other gift shop in the market." },
              { num: "02", title: "Mix designs in one order", desc: "Try a few designs, see what sells in your area, then reorder only those." },
              { num: "03", title: "Festive and bulk gifting", desc: "Gift boxes and branded packaging for corporate orders and festive hampers, with your logo on the box or the tray." },
              { num: "04", title: "Full matching sets", desc: "Trays, coasters and candy boxes in one design let your customers buy a complete look and raise your bill value." }
            ].map((item) => (
              <div key={item.num} className="border-t border-stone-300 pt-5">
                <span className="text-xs font-semibold tracking-[0.14em] text-[#7a5c25]">{item.num}</span>
                <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mt-2">{item.title}</h3>
                <p className="text-[15px] text-stone-600 leading-relaxed mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Wholesale & Dealer FAQs */}
      <section className="py-16 sm:py-24 bg-[#F4EFE7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900 text-center mb-10 sm:mb-12">Questions dealers ask</h2>
          <div className="border-t border-stone-300">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-stone-300">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  className="w-full text-left flex justify-between items-center py-5 sm:py-6 text-base sm:text-lg font-medium text-stone-900 cursor-pointer gap-6"
                >
                  <span>{faq.q}</span>
                  <span className="text-2xl leading-none text-stone-500 shrink-0">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <p className="text-[15px] text-stone-600 pb-6 -mt-1 leading-relaxed max-w-2xl">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. About Brand Story */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative flex justify-center">
              <div className="w-full sm:w-[460px] h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl relative border-2 border-stone-200">
                <img src={pageImages.home_story} alt="A Divine Home India tray being finished by hand" className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-stone-200 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                  <div>
                    <p className="font-serif text-xs font-bold text-stone-900">Karol Bagh, New Delhi</p>
                    <p className="text-[11px] text-stone-500 uppercase">Designed and finished in-house</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="space-y-6 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-[#7a5c25] font-bold block">About Divine Home India</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">Designed in Delhi, Supplied Across India</h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">Divine Home India started in Karol Bagh in 2015. We design our own tray prints, have them made to our standard, and supply gift shops, decor stores, distributors, hotels and corporate gifting companies across India. Every design is on display at our showroom, so you can see the finish before you order.</p>
              <div className="flex justify-center lg:justify-start gap-4 pt-2">
                <Link to="/about" className="bg-stone-900 hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full transition-colors inline-block shadow-md">Read Full Story &rarr;</Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Wholesale Bulk Enquiry Popup Modal */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => { setIsRfqModalOpen(false); setRfqSubmitted(false); }}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-stone-200/60 hover:bg-stone-300 flex items-center justify-center text-stone-800 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6 pr-8">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#7a5c25] font-semibold block mb-1">
                B2B Wholesale Trade Desk
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Wholesale Bulk Enquiry
              </h3>
            </div>

            {rfqSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 sm:p-8 rounded-2xl text-center space-y-3">
                <h4 className="font-serif text-lg sm:text-xl font-bold">RFQ Request Submitted!</h4>
                <p className="text-xs">Thank you, {rfqForm.name}. Our Karol Bagh trade desk will review your bulk enquiry and connect with your wholesale price sheet within 2 hours.</p>
                <button 
                  onClick={() => { setIsRfqModalOpen(false); setRfqSubmitted(false); }}
                  className="mt-4 bg-stone-900 text-white text-xs uppercase px-6 py-2.5 rounded-xl font-semibold tracking-wider hover:bg-[#C5A059] cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={rfqForm.name}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Company / Cafe / Retail Name</label>
                    <input 
                      type="text" 
                      name="company"
                      placeholder="e.g. Roastery Cafe & Kitchen"
                      value={rfqForm.company}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={rfqForm.phone}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Business Email</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="procurement@brand.com"
                      value={rfqForm.email}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Estimated Quantity Required *</label>
                    <input 
                      type="text" 
                      name="quantity"
                      required
                      placeholder="e.g. 100 sets / 250 pcs"
                      value={rfqForm.quantity}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Delivery City / Pincode *</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      placeholder="e.g. Mumbai, 400001"
                      value={rfqForm.city}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Customization or Special Instructions</label>
                  <textarea 
                    name="instructions"
                    rows="2"
                    placeholder="Need custom logo debossing / specific color glaze / packaging details..."
                    value={rfqForm.instructions}
                    onChange={handleRfqChange}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a 
                    href={`https://wa.me/918459495594?text=Hello,%20I%20want%20to%20enquire%20about%20bulk%20wholesale%20order%20for%20${rfqForm.quantity || 'bulk items'}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#00A859] hover:bg-[#008f4c] text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                  >
                    <span>💬</span> Instant WhatsApp Quote
                  </a>
                  <button 
                    type="submit"
                    disabled={submittingRfq}
                    className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <span>✈</span> {submittingRfq ? 'SUBMITTING...' : 'Submit RFQ Request'}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-stone-500 font-medium">
                    🛡️ GST Invoicing & Pan-India Delivery
                  </span>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

Home.displayName = 'Home';
export default Home;
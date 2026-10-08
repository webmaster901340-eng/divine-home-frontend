import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Super Smooth & Guaranteed Scroll Reveal Component
const FadeIn = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.05 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      if (direction === "up") return "translate-y-10 opacity-0";
      if (direction === "down") return "-translate-y-10 opacity-0";
      if (direction === "left") return "translate-x-10 opacity-0";
      if (direction === "right") return "-translate-x-10 opacity-0";
      if (direction === "zoom") return "scale-95 opacity-0";
    }
    return "translate-y-0 translate-x-0 scale-100 opacity-100";
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ease-out ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};

const About = () => {
  const location = useLocation();
  const [pageImages, setPageImages] = useState({
    about_hero: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=1920",
    about_img1: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
    about_img2: "https://images.unsplash.com/photo-1581783342894-3ee46533f08b?auto=format&fit=crop&q=80&w=600"
  });

  useEffect(() => {
    const saved = localStorage.getItem('dhi_page_images');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPageImages(prev => ({...prev, ...data}));
      } catch (err) {
        // Silently fail
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (location.pathname.includes('shipping-policy')) {
      const el = document.getElementById('shipping-policy');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (location.pathname.includes('privacy-policy')) {
      const el = document.getElementById('privacy-policy');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (location.pathname.includes('wholesale-terms')) {
      const el = document.getElementById('wholesale-terms');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (location.pathname.includes('dealer-registration')) {
      const el = document.getElementById('dealer-registration');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-hidden">
      
      {/* 1. Hero Header Section */}
      <section className="relative bg-stone-900 text-white py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src={pageImages.about_hero}
          alt="Luxury Ceramics"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />

        <div className="relative z-20 max-w-4xl mx-auto space-y-4">
          <FadeIn direction="up" delay={100}>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block">
              Wholesale • Dealers • Distributors
            </span>
          </FadeIn>
          
          <FadeIn direction="up" delay={250}>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Luxury Handcrafted Home Décor, Artisan Trays & Fine Ceramics
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={400}>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed pt-2">
              Welcome to Divine Home India. Established in the commercial heart of Karol Bagh, New Delhi, we are a leading B2B wholesale distribution partner for premium retailers, luxury gifting curators, and interior architects nationwide.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Floating Stats Bar Section */}
      <FadeIn direction="zoom" delay={150} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 mb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-stone-100 last:border-none">
            <p className="font-sans text-3xl font-bold text-stone-900 tracking-tight">500+</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Curated Décor SKUs</p>
          </div>
          <div className="border-r border-stone-100 last:border-none">
            <p className="font-sans text-3xl font-bold text-stone-900 tracking-tight">280+</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Retail & Trade Dealers</p>
          </div>
          <div className="border-r border-stone-100 last:border-none">
            <p className="font-serif text-3xl font-bold text-stone-900">Karol Bagh</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Delhi Showroom Hub</p>
          </div>
          <div>
            <p className="font-sans text-3xl font-bold text-stone-900 tracking-tight">100%</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Insured Transit Safety</p>
          </div>
        </div>
      </FadeIn>

      {/* 3. Our Vision & Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content (7 Columns) */}
          <FadeIn direction="left" className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block">
              Our Vision
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Empowering Interior Boutiques & Dealers with Timeless Handcrafted Luxury
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light max-w-xl">
              At Divine Home India, we believe every tabletop, vanity, and console deserves the tactile warmth of handcrafted artistry. From mirror-finish vanity trays and hammered brass accent platters to high-fired vitrified ceramic dinnerware, our wholesale catalog is designed to stand out on retail shelves and luxury projects alike.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light max-w-xl">
              We eliminate traditional distribution bottlenecks by operating a direct B2B trade hub out of Karol Bagh, New Delhi. Every order is inspected piece-by-piece, cushioned in export-grade packaging, and shipped with end-to-end tracking to dealers across all Indian states.
            </p>

            {/* Karol Bagh Showroom Badge Box */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex items-start gap-4">
              <span className="text-xl">📍</span>
              <div>
                <h3 className="font-serif text-xs font-bold text-stone-900">Karol Bagh, New Delhi Showroom</h3>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  Dealers and distributors are welcome to visit our Delhi showroom to inspect material samples, finishes, and master packaging in person.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right Images Grid (5 Columns) */}
          <FadeIn direction="right" className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="h-[380px] rounded-3xl overflow-hidden shadow-lg bg-stone-100">
              <img
                src={pageImages.about_img1}
                alt="Artisan Trays"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="h-[380px] rounded-3xl overflow-hidden shadow-lg bg-stone-100 sm:mt-8">
              <img
                src={pageImages.about_img2}
                alt="Ceramic Vases"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 4. Why Dealers & Retailers Partner With Us */}
      <section className="py-20 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
          <FadeIn direction="down">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-2">
              Trade Partnerships
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
              Why Dealers & Retailers Partner With Us
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto font-light">
              A wholesale supply system built around margin protection, fast inventory replenishment, and zero-breakage guarantee.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Artisan Handcrafted Quality", desc: "Every tray, bowl, and vase features authentic artisanal finishing—from polished brass borders to natural reactive glazes." },
            { num: "02", title: "Direct Distributor Margins", desc: "Transparent wholesale pricing tiers engineered to ensure healthy retail margins for our dealers and corporate gift houses." },
            { num: "03", title: "Festive & Bulk Gifting", desc: "Custom gift packaging, satin lining, and coordinated combos ready for corporate gifting and festive hampers." },
            { num: "04", title: "Zero-Breakage Guarantee", desc: "Palletized shipments with multi-layer bubble and corrugated armor ensure delicate trays and ceramics arrive pristine." }
          ].map((item, idx) => (
            <FadeIn key={idx} direction="up" delay={idx * 150}>
              <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between text-left h-full">
                <div>
                  <span className="font-serif text-2xl font-bold text-[#C5A059] block mb-4">{item.num}</span>
                  <h3 className="font-serif text-base font-bold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 5. DEALER POLICIES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200/80">
        <FadeIn direction="down" className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-2">
            Legal & Trade Guidelines
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Dealer Policies & Commercial Terms
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <FadeIn direction="left" delay={100}>
            <div id="dealer-registration" className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm scroll-mt-28 h-full">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold block mb-2">Onboarding</span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Dealer Registration & RFQ</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Verified retailers, interior architects, and corporate gifting houses can register as official trade partners by submitting bulk inquiries through our wholesale desk or visiting our Karol Bagh showroom. Approved dealers receive quarterly lookbooks and custom slab pricing.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={200}>
            <div id="shipping-policy" className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm scroll-mt-28 h-full">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold block mb-2">Logistics & Safety</span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Shipping & Zero-Breakage Policy</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                We pack all orders using 5-ply export corrugation, individual bubble armor, and heavy-duty wooden palletization. In the rare event of transit damage, we offer instant replacement or credit note against unboxing photographs.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={300}>
            <div id="privacy-policy" className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm scroll-mt-28 h-full">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold block mb-2">Data Confidentiality</span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Commercial Privacy Policy</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                All trade inquiries, B2B dealer contact numbers, and corporate pricing requests are kept strictly confidential and used solely for fulfilling wholesale dispatches and order coordination from our Karol Bagh trade desk.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={400}>
            <div id="wholesale-terms" className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm scroll-mt-28 h-full">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold block mb-2">B2B Contracts</span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Terms & Wholesale Conditions</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Minimum Order Quantities (MOQ) apply as explicitly stated per product SKU. B2B orders are processed securely against verified advance bank transfers, NEFT/RTGS, or approved trade credit terms.
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 6. Bottom Black CTA Box */}
      <FadeIn direction="zoom" delay={150} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-10 sm:p-14 text-center shadow-xl space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            Become an Authorized Divine Home Dealer
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Connect with our wholesale trade desk in Karol Bagh to receive our complete master lookbook and MOQ price list.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link 
              to="/wholesale" 
              className="bg-white hover:bg-[#C5A059] text-stone-900 hover:text-white px-8 py-4 rounded-full font-semibold text-xs tracking-widest uppercase transition-colors shadow-lg cursor-pointer"
            >
              Request Dealer Wholesale Price Sheet
            </Link>
            <a 
              href="https://wa.me/919811023456" 
              target="_blank" 
              rel="noreferrer"
              className="bg-transparent border border-stone-600 hover:border-white text-white px-8 py-4 rounded-full font-semibold text-xs tracking-widest uppercase transition-colors cursor-pointer"
            >
              Visit Karol Bagh Showroom
            </a>
          </div>
        </div>
      </FadeIn>

    </div>
  );
};

About.displayName = 'About';
export default About;
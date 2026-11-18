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

const About = () => {
  const location = useLocation();
  const [pageImages, setPageImages] = useState({
    about_hero: "/images/dhi/showroom-tray-shelves.jpg",
    about_img1: "/images/dhi/mango-wood-trays.jpg",
    about_img2: "/images/dhi/printed-tray-set.jpg"
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
          alt="Divine Home India showroom, Karol Bagh, New Delhi"
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
              About Divine Home India
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={400}>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed pt-2">
              We started in 2015 in Karol Bagh, New Delhi, supplying home and kitchen products to local shops. Trays became the product our dealers asked for most, so we began designing our own. Today we supply gift shops, decor stores, hotels and corporate gifting companies across India.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Floating Stats Bar Section */}
      <FadeIn direction="zoom" delay={150} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 mb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-stone-100 last:border-none">
            <p className="font-sans text-3xl font-bold text-stone-900 tracking-tight">2015</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Supplying Since</p>
          </div>
          <div className="border-r border-stone-100 last:border-none">
            <p className="font-sans text-3xl font-bold text-stone-900 tracking-tight">250+</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Dealers Across India</p>
          </div>
          <div className="border-r border-stone-100 last:border-none">
            <p className="font-serif text-3xl font-bold text-stone-900">Karol Bagh</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Delhi Showroom Hub</p>
          </div>
          <div>
            <p className="font-sans text-3xl font-bold text-stone-900 tracking-tight">50+</p>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Distributors</p>
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
              Our own designs, made to a standard your customers notice
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light max-w-xl">
              We design every tray print in-house: the Ellite, Premium and Glass Foil tray series, hand-printed Mangowood sets, Leather Classic organisers, and ceramic snack, candy and crockery sets that match our tray designs. Because the designs are ours, your shelf won't look like the shop next door.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light max-w-xl">
              You deal with us directly, from our showroom in Karol Bagh, New Delhi. Orders are checked before packing, packed in corrugated cartons with bubble wrap, and sent by transport or courier anywhere in India.
            </p>

            {/* Karol Bagh Showroom Badge Box */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex items-start gap-4">
              <span className="text-xl">📍</span>
              <div>
                <h3 className="font-serif text-xs font-bold text-stone-900">Karol Bagh, New Delhi Showroom</h3>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  Every design is on display. Come and compare finishes side by side before you order. Monday to Saturday, 10:30 am to 8 pm.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right Images Grid (5 Columns) */}
          <FadeIn direction="right" className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="h-[380px] rounded-3xl overflow-hidden shadow-lg bg-stone-100">
              <img
                src={pageImages.about_img1}
                alt="Hand-printed mango wood tray sets"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="h-[380px] rounded-3xl overflow-hidden shadow-lg bg-stone-100 sm:mt-8">
              <img
                src={pageImages.about_img2}
                alt="Printed decorative tray set with matching pieces"
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
              Why gift shops, decor stores and distributors keep reordering from us.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Designs Made In-House", desc: "We develop our own tray prints, so your shelf doesn't look like every other gift shop in the market." },
            { num: "02", title: "Mix Designs In One Order", desc: "Try a few designs, see what sells in your area, then reorder only those." },
            { num: "03", title: "Festive & Bulk Gifting", desc: "Gift boxes and branded packaging for corporate orders and festive hampers, with your logo on the box or the tray." },
            { num: "04", title: "Full Matching Sets", desc: "Trays, coasters and candy boxes in one design let your customers buy a complete look and raise your bill value." }
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
                Shops, distributors, hotels and corporate gifting companies can become dealers by sending the wholesale form or visiting our Karol Bagh showroom with their business details. We then share the catalogue and trade price list.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={200}>
            <div id="shipping-policy" className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm scroll-mt-28 h-full">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold block mb-2">Logistics & Safety</span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Shipping & Delivery</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                We dispatch across India by transport or courier, packed in corrugated cartons with bubble wrap. Delhi NCR buyers can also collect orders from our Karol Bagh showroom. If anything arrives damaged, send us unboxing photos and our team will sort it out.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={300}>
            <div id="privacy-policy" className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm scroll-mt-28 h-full">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold block mb-2">Data Confidentiality</span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Commercial Privacy Policy</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                We use the details you send us only to reply to your enquiry and handle your orders. We never sell or share them.
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
            Send us your shop name and city and we will share the 2026-27 catalogue with trade prices.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link 
              to="/wholesale" 
              className="bg-white hover:bg-[#C5A059] text-stone-900 hover:text-white px-8 py-4 rounded-full font-semibold text-xs tracking-widest uppercase transition-colors shadow-lg cursor-pointer"
            >
              Request Dealer Wholesale Price Sheet
            </Link>
            <a 
              href="https://wa.me/918459495594" 
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
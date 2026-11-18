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
    about_hero: "/images/hero/elegant-vector-tray-set-lifestyle.jpg",
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
    <div className="min-h-screen bg-[#FBF9F5] overflow-hidden">

      {/* 1. Split hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-14 sm:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <h1 className="font-serif text-[34px] sm:text-5xl leading-[1.1] text-stone-900">
              About Divine Home India
            </h1>
            <p className="text-[15px] sm:text-base text-stone-600 leading-relaxed mt-5">
              We started in 2015 in Karol Bagh, New Delhi, supplying home and kitchen products to local shops. Trays became the product our dealers asked for most, so we began designing our own. Today we supply gift shops, decor stores, hotels and corporate gifting companies across India.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/collections" className="inline-flex items-center px-7 py-4 bg-stone-900 hover:bg-[#3a2f24] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors">See the collection</Link>
              <Link to="/wholesale" className="inline-flex items-center px-7 py-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors">Become a dealer</Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="aspect-[16/10] overflow-hidden bg-[#E9E2D6]">
              <img src={pageImages.about_hero} alt="Divine Home India tray collection" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-stone-300 divide-x divide-stone-200">
          {[['2015', 'Supplying since'], ['250+', 'Dealers across India'], ['Karol Bagh', 'Delhi showroom'], ['50+', 'Distributors']].map(([v, l], i) => (
            <div key={l} className={`py-6 sm:py-8 text-center ${i === 2 ? 'border-t md:border-t-0 border-stone-200' : ''} ${i === 3 ? 'border-t md:border-t-0 border-stone-200' : ''}`}>
              <p className="font-serif text-[26px] sm:text-4xl text-stone-900">{v}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-stone-600 mt-1.5">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900">
              Our own designs, made to a standard your customers notice
            </h2>
            <p className="text-[15px] sm:text-base text-stone-600 leading-relaxed">
              We design every tray print in-house: the Ellite, Premium and Glass Foil tray series, hand-printed Mangowood sets, Leather Classic organisers, and ceramic snack, candy and crockery sets that match our tray designs. Because the designs are ours, your shelf won't look like the shop next door.
            </p>
            <p className="text-[15px] sm:text-base text-stone-600 leading-relaxed">
              You deal with us directly, from our showroom in Karol Bagh, New Delhi. Orders are checked before packing, packed in corrugated cartons with bubble wrap, and sent by transport or courier anywhere in India.
            </p>
            <div className="border-l-2 border-[#C5A059] pl-4 mt-2">
              <p className="text-[15px] font-semibold text-stone-900">Visit the Karol Bagh showroom</p>
              <p className="text-[15px] text-stone-600 leading-relaxed mt-0.5">Every design is on display. Compare finishes side by side before you order. Monday to Saturday, 10:30 am to 8 pm.</p>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="aspect-[4/5] overflow-hidden bg-[#E9E2D6]">
              <img src={pageImages.about_img1} alt="Hand-printed mango wood tray sets" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-[#E9E2D6] mt-8 sm:mt-12">
              <img src={pageImages.about_img2} alt="Printed decorative tray set with matching pieces" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why dealers */}
      <section className="py-16 sm:py-24 bg-[#F4EFE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900">Why shops reorder from us</h2>
            <p className="text-[15px] text-stone-600 mt-4 leading-relaxed">Gift shops, decor stores and distributors keep coming back. Here is why.</p>
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

      {/* 5. Dealer policies */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900 mb-10 sm:mb-14">Dealer policies and terms</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {[
            ['dealer-registration', 'Dealer registration', 'Shops, distributors, hotels and corporate gifting companies can become dealers by sending the wholesale form or visiting our Karol Bagh showroom with their business details. We then share the catalogue and trade price list.'],
            ['shipping-policy', 'Shipping and delivery', 'We dispatch across India by transport or courier, packed in corrugated cartons with bubble wrap. Delhi NCR buyers can also collect orders from our Karol Bagh showroom. If anything arrives damaged, send us unboxing photos and our team will sort it out.'],
            ['privacy-policy', 'Privacy', 'We use the details you send us only to reply to your enquiry and handle your orders. We never sell or share them.'],
            ['wholesale-terms', 'Wholesale terms', 'Minimum order quantities apply as stated for each product. Orders are processed against advance bank transfer (NEFT/RTGS) or agreed trade credit terms.']
          ].map(([id, t, d]) => (
            <div key={id} id={id} className="border-t border-stone-300 pt-5 scroll-mt-28">
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900">{t}</h3>
              <p className="text-[15px] text-stone-600 leading-relaxed mt-3">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA */}
      <section className="bg-[#211c17] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl sm:text-[40px] leading-[1.12] text-white">Become a Divine Home dealer</h2>
            <p className="text-[15px] sm:text-base text-white/80 mt-3 leading-relaxed">Send us your shop name and city and we will share the 2026-27 catalogue with trade prices.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/wholesale" className="inline-flex justify-center items-center px-7 py-4 bg-[#FBF9F5] hover:bg-white text-stone-900 text-xs font-semibold uppercase tracking-[0.14em] transition-colors">Get the price list</Link>
            <a href="https://wa.me/918459495594" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center px-7 py-4 border border-white/70 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors">WhatsApp us</a>
          </div>
        </div>
      </section>

    </div>
  );
};

About.displayName = 'About';
export default About;
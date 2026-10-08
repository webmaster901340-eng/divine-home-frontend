import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../utils/api';
import { Link } from 'react-router-dom';
import RFQModal from './RFQModal';

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

const Footer = () => {
  const [isRFQOpen, setIsRFQOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      alert("Please enter a valid business email address.");
      return;
    }

    setSubscribing(true);

    const leadPayload = {
      name: 'B2B Newsletter Subscriber',
      company: 'Dealer Network',
      phone: 'N/A',
      email: newsletterEmail,
      quantity: 'Quarterly Catalog & Rate Sheet',
      city: 'Pan-India',
      instructions: 'Subscribed via Footer B2B Network Callout'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Thank you for subscribing to Divine Home India B2B Trade Network! Our team will share the rate sheet shortly.");
        setNewsletterEmail('');
      } else {
        alert("Subscription error: " + (data.error || "Please try again"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Failed to connect to server. Make sure your backend is running.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <footer className="w-full bg-[#0c0a09] text-stone-300 pt-16 pb-12 border-t border-stone-800 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Newsletter / B2B Network Callout */}
          <FadeIn direction="up">
            <div className="pb-16 mb-16 border-b border-stone-800/80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-2">
                  Trade Lookbook & Price List
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Join Our B2B Dealer Network
                </h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xl font-light">
                  Subscribe to receive quarterly new artisan tray launches, festive catalog previews, and updated wholesale rate sheets.
                </p>
              </div>
              
              <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Enter business / dealer email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C5A059] sm:w-72"
                />
                <button 
                  type="submit"
                  disabled={subscribing}
                  className="bg-[#C5A059] hover:bg-[#b08d4c] text-stone-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe →'}
                </button>
              </form>
            </div>
          </FadeIn>

          {/* 4-Column Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
            
            {/* Column 1: Brand Info */}
            <FadeIn direction="up" delay={100}>
              <div className="space-y-4">
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Divine Home India
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium">
                  Karol Bagh, New Delhi
                </p>

                <div className="space-y-2 text-xs text-stone-400 pt-2 font-light">
                  <p className="flex items-center gap-2"><span>✨</span> Luxury Handcrafted Home Décor</p>
                  <p className="flex items-center gap-2"><span>🏺</span> Artisan Trays · Ceramics · Décor</p>
                  <p className="flex items-center gap-2"><span>💛</span> Wholesale · Dealers · Distributors</p>
                </div>

                <div className="pt-2">
                  <a 
                    href="https://www.instagram.com/divinehomeindia" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2.5 rounded-full border border-white/10 transition-colors"
                  >
                    <span>📷</span> Follow @divinehomeindia
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Column 2: Wholesale Lines */}
            <FadeIn direction="up" delay={200}>
              <div className="space-y-4">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-white">
                  Wholesale Lines
                </h4>
                <ul className="space-y-2.5 text-xs text-stone-400 font-light">
                  <li>
                    <Link 
                      to="/collections?category=Artisan+Trays+%26+Platters" 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="hover:text-[#C5A059] transition-colors"
                    >
                      Artisan Trays & Platters
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/collections?category=Ceramics+%26+Tableware" 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="hover:text-[#C5A059] transition-colors"
                    >
                      Ceramics & Tableware
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/collections?category=Luxury+Home+D%C3%A9cor" 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="hover:text-[#C5A059] transition-colors"
                    >
                      Luxury Home Décor
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/collections?category=Table+Vases+%26+Urns" 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="hover:text-[#C5A059] transition-colors"
                    >
                      Table Vases & Urns
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/collections?category=Designer+Coffee+Mugs" 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="hover:text-[#C5A059] transition-colors"
                    >
                      Designer Coffee Mugs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/collections?category=Festive+%26+Gifting+Sets" 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="hover:text-[#C5A059] transition-colors"
                    >
                      Festive & Gifting Sets
                    </Link>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link 
                    to="/collections" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-xs text-[#C5A059] hover:underline uppercase tracking-wider font-semibold"
                  >
                    View All Collections →
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Column 3: Dealer Policies */}
            <FadeIn direction="up" delay={300}>
              <div className="space-y-4">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-white">
                  Dealer Policies
                </h4>
                <ul className="space-y-2.5 text-xs text-stone-400 font-light">
                  <li>
                    <Link to="/policy/dealer-registration" className="hover:text-[#C5A059] transition-colors">
                      Dealer Registration & RFQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/policy/shipping-policy" className="hover:text-[#C5A059] transition-colors">
                      Shipping & Zero-Breakage Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/policy/wholesale-terms" className="hover:text-[#C5A059] transition-colors">
                      Terms & Wholesale Conditions
                    </Link>
                  </li>
                  <li>
                    <Link to="/policy/privacy-policy" className="hover:text-[#C5A059] transition-colors">
                      Commercial Privacy Policy
                    </Link>
                  </li>
                </ul>
                <div className="pt-2">
                  <span 
                    onClick={() => setIsRFQOpen(true)} 
                    className="text-xs text-[#C5A059] hover:underline uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Request Master Price Sheet →
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Column 4: Showroom & Office */}
            <FadeIn direction="up" delay={400}>
              <div className="space-y-4">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-white">
                  Showroom & Office
                </h4>
                <div className="space-y-3 text-xs text-stone-400 font-light">
                  <p className="flex items-start gap-2.5">
                    <span className="text-[#C5A059] mt-0.5">📍</span>
                    <span>Commercial Trade Zone, Karol Bagh, New Delhi, Delhi - 110005, India</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <span className="text-[#C5A059]">📞</span>
                    <a href="tel:+919811023456" className="hover:text-white transition-colors">+91 98110 23456</a>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <span className="text-[#C5A059]">✉️</span>
                    <a href="mailto:wholesale@divinehomeindia.com" className="hover:text-white transition-colors">wholesale@divinehomeindia.com</a>
                  </p>
                </div>

                <div className="pt-3">
                  <a 
                    href="https://wa.me/919811023456" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <span>💬</span> Direct WhatsApp Trade Desk
                  </a>
                </div>
              </div>
            </FadeIn>

          </div>

          {/* Bottom Copyright, Badges & Secret Admin Link */}
          <FadeIn direction="up">
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4 font-light">
              <p>© 2026 Divine Home India. All Rights Reserved. • Wholesale · Dealers · Distributors</p>
              
              <div className="flex items-center gap-6">
                <span className="text-emerald-500 flex items-center gap-1">✓ Pan-India Insured Dispatch</span>
                <span>Karol Bagh, New Delhi, India</span>
                <Link 
                  to="/admin/login" 
                  className="text-stone-700 hover:text-[#C5A059] transition-colors font-bold text-base select-none"
                  title="Admin Access"
                >
                  ·
                </Link>
              </div>
            </div>
          </FadeIn>

        </div>
      </footer>

      {/* RFQ POP-UP MODEL */}
      <RFQModal 
        isOpen={isRFQOpen} 
        onClose={() => setIsRFQOpen(false)} 
        productTitle="Master Price Sheet & Catalog" 
      />
    </>
  );
};

Footer.displayName = 'Footer';
export default Footer;
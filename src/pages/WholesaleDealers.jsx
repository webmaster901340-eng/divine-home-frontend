import React, { useState, useEffect, useRef } from 'react';

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

const WholesaleDealers = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessCategory: 'Retail Store / Dealer',
    gstin: '',
    phone: '',
    email: '',
    collectionInterest: 'Artisan Trays & Platters',
    orderVolume: '',
    destination: '',
    timeline: 'Within 2 Weeks',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "What is the Minimum Order Quantity (MOQ)?",
      a: "Our wholesale MOQ starts from 30–50 pieces per SKU for artisan trays and ceramic tableware, and 20 pieces for statement decor pieces. Mixed category assortments are available for registered dealers."
    },
    {
      q: "Can I visit the showroom in Karol Bagh?",
      a: "Yes! Dealers, architects, and retail buyers are welcome to visit our Karol Bagh, New Delhi trade showroom to view product finishes, sample trays, and discuss bulk margins in person."
    },
    {
      q: "What is your transit breakage policy?",
      a: "We pack using 5-ply export corrugation, individual bubble armor, and wooden palletization. In the rare event of transit damage, we offer instant replacement or credit note against unboxing photographs."
    },
    {
      q: "Do you offer custom corporate gifting branding?",
      a: "Yes! For bulk corporate gifting and festive hampers, we provide custom satin-lined keepsake packaging, custom branding tags, and personalized greeting inserts."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section */}
        <FadeIn direction="down" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold block mb-2">
            WHOLESALE • DEALERS • DISTRIBUTORS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Request Wholesale & Dealer Pricing
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
            Fill out the B2B quotation form below or connect with our Karol Bagh trade desk directly on WhatsApp. We provide factory-direct wholesale pricing, sample shipments, and festive gifting catalogs.
          </p>
        </FadeIn>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Left Box: B2B Quotation Form (7 Columns) */}
          <FadeIn direction="left" className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100">
              Trade Buyer & Procurement Details
            </h2>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-3">
                <h3 className="font-serif text-xl font-bold">RFQ Submitted Successfully!</h3>
                <p className="text-xs">Thank you, {formData.fullName}. Our Karol Bagh trade desk will review your inquiry and connect with your wholesale price sheet within 2 business hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-stone-900 text-white text-xs uppercase px-6 py-2.5 rounded-xl font-semibold tracking-wider hover:bg-[#C5A059] transition-colors cursor-pointer"
                >
                  Submit Another RFQ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      placeholder="e.g. Rajesh Khurana"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Business / Firm Name *</label>
                    <input 
                      type="text" 
                      name="businessName"
                      required
                      placeholder="e.g. Khurana Décor & Gift Emporium"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Business Category *</label>
                    <select 
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option>Retail Store / Dealer</option>
                      <option>Interior Designer / Architect</option>
                      <option>Corporate Gifting House</option>
                      <option>Hospitality / Hotel Chain</option>
                      <option>Export / Distributor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">GSTIN (Optional for initial quote)</label>
                    <input 
                      type="text" 
                      name="gstin"
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Business Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="procurement@store.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Primary Collection of Interest *</label>
                    <select 
                      name="collectionInterest"
                      value={formData.collectionInterest}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option>Artisan Trays & Platters</option>
                      <option>Ceramics & Tableware</option>
                      <option>Luxury Home Décor</option>
                      <option>Table Vases & Urns</option>
                      <option>Designer Coffee Mugs</option>
                      <option>Festive & Gifting Sets</option>
                      <option>Bath & Vanity Sets</option>
                      <option>Stoneware Planters</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Estimated Order Volume *</label>
                    <input 
                      type="text" 
                      name="orderVolume"
                      required
                      placeholder="e.g. 50 trays / 100 sets"
                      value={formData.orderVolume}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Delivery Destination (City / State) *</label>
                    <input 
                      type="text" 
                      name="destination"
                      required
                      placeholder="e.g. Mumbai / Jaipur / Surat"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Required Order Timeline</label>
                    <select 
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option>Immediate / Within 1 Week</option>
                      <option>Within 2 Weeks</option>
                      <option>Within 1 Month</option>
                      <option>Festive Season Planning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Specific Requirements or Custom Branding Notes</label>
                  <textarea 
                    name="notes"
                    rows="3"
                    placeholder="Mention if you require custom packaging boxes, sample kits, or wish to schedule a Karol Bagh showroom visit..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                  ></textarea>
                </div>

                {/* Form Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-4 rounded-xl font-semibold text-xs uppercase tracking-widest transition-colors shadow-md cursor-pointer"
                  >
                    SUBMIT DEALER RFQ
                  </button>
                  <a 
                    href="https://wa.me/919811023456?text=Hello,%20I%20want%20to%20request%20wholesale%20pricing%20and%20dealer%20catalog."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md text-center"
                  >
                    <span>💬</span> WHATSAPP DIRECT RFQ
                  </a>
                </div>
              </form>
            )}
          </FadeIn>

          {/* Right Column: Support Desk & Advantages (5 Columns) */}
          <FadeIn direction="right" className="lg:col-span-5 space-y-6">
            
            {/* Support Desk Card */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
                KAROL BAGH WHOLESALE DESK
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">
                Connect Directly with Trade Specialists
              </h3>

              <div className="space-y-4 text-xs text-stone-600 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-base">📞</span>
                  <div>
                    <p className="font-semibold text-stone-900">Wholesale Desk:</p>
                    <p>+91 98110 23456</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base">✉️</span>
                  <div>
                    <p className="font-semibold text-stone-900">Trade Email:</p>
                    <p>wholesale@divinehomeindia.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base">⏰</span>
                  <div>
                    <p className="font-semibold text-stone-900">Showroom Hours:</p>
                    <p>Mon - Sat: 10:30 AM - 8:00 PM IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base">📍</span>
                  <div>
                    <p className="font-semibold text-stone-900">Location:</p>
                    <p>Commercial Trade Zone, Karol Bagh, New Delhi - 110005</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://wa.me/919811023456" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-[#E9FCEF] hover:bg-[#D5F7E2] text-emerald-800 border border-emerald-300 py-3.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>💬</span> Chat with Wholesale Trade Desk
              </a>
            </div>

            {/* Authorized Dealer Advantages Card */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-5">
                Authorized Dealer Advantages
              </h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <span className="text-stone-900 font-bold text-sm">🛡️</span>
                  <div>
                    <strong className="text-stone-900 block font-medium">Direct Factory Margins:</strong>
                    Competitive volume rates allowing healthy retail margins.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-stone-900 font-bold text-sm">🚚</span>
                  <div>
                    <strong className="text-stone-900 block font-medium">Insured Pallet Logistics:</strong>
                    Zero-breakage delivery guarantee across all Indian states.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-stone-900 font-bold text-sm">⚡</span>
                  <div>
                    <strong className="text-stone-900 block font-medium">Priority Sample Dispatch:</strong>
                    Quick 48-hour sample dispatch for registered trade buyers.
                  </div>
                </div>
              </div>
            </div>

          </FadeIn>

        </div>

        {/* Wholesale & Dealer FAQs Section */}
        <FadeIn direction="up" className="pt-12 border-t border-stone-200">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Wholesale & Dealer FAQs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm">
                <h3 className="font-serif text-base font-bold text-stone-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

      </div>
    </div>
  );
};

export default WholesaleDealers;
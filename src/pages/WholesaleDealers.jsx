import React, { useState, useEffect, useRef } from 'react';
import { FAQ } from '../seo/pages';

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

const WholesaleDealers = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessCategory: 'Retail Store / Dealer',
    gstin: '',
    phone: '',
    email: '',
    collectionInterest: 'Decorative Tray Sets',
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

  const faqs = FAQ.map(([q, a]) => ({ q, a }));

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-20">
          <div className="lg:col-span-6">
            <h1 className="font-serif text-[34px] sm:text-5xl leading-[1.1] text-stone-900">
              Get our wholesale price list
            </h1>
            <p className="text-[15px] sm:text-base text-stone-600 leading-relaxed mt-5 max-w-xl">
              Tell us about your business and we will send the 2026-27 catalogue with trade prices. Prefer to talk? WhatsApp us on +91 84594 95594 or visit the Karol Bagh showroom to see every design in person.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#rfq-form" className="inline-flex items-center px-7 py-4 bg-stone-900 hover:bg-[#3a2f24] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors">Request price list</a>
              <a href="https://wa.me/918459495594?text=Hello,%20I%20want%20to%20request%20wholesale%20pricing%20and%20dealer%20catalog." target="_blank" rel="noreferrer" className="inline-flex items-center px-7 py-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors">WhatsApp us</a>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[16/11] overflow-hidden bg-[#E9E2D6]">
              <img src="/images/hero/elegant-vector-gold-tray-set.jpg" alt="Elegant Vector tray collection by Divine Home India" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* How ordering works */}
        <div className="grid sm:grid-cols-3 gap-x-10 gap-y-8 mb-16 sm:mb-24">
          {[
            ['01', 'Send your details', 'Fill in the form or WhatsApp us your shop name, city and the designs you like.'],
            ['02', 'Get prices and stock', 'We send the 2026-27 catalogue with trade prices and current stock, usually the same day.'],
            ['03', 'Order and dispatch', 'Confirm your mix of designs. We pack in cartons with bubble wrap and dispatch across India with a GST invoice.']
          ].map(([n, t, d]) => (
            <div key={n} className="border-t border-stone-300 pt-5">
              <span className="text-xs font-semibold tracking-[0.14em] text-[#7a5c25]">{n}</span>
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 mt-2">{t}</h2>
              <p className="text-[15px] text-stone-600 leading-relaxed mt-2">{d}</p>
            </div>
          ))}
        </div>

        {/* Main Grid Section */}
        <div id="rfq-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20 scroll-mt-28">
          
          {/* Left Box: B2B Quotation Form (7 Columns) */}
          <FadeIn direction="left" className="lg:col-span-7 bg-white p-6 sm:p-10 border border-stone-200">
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-2">
              Request the trade price list
            </h2>

            {submitted ? (
              <div className="border border-stone-300 p-8 text-center space-y-3 mt-5">
                <h3 className="font-serif text-2xl text-stone-900">Thank you, we have your request</h3>
                <p className="text-[15px] text-stone-600">Thank you, {formData.fullName}. Our Karol Bagh trade desk will review your inquiry and connect with your wholesale price sheet within 2 business hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white text-xs uppercase px-6 py-3 font-semibold tracking-[0.14em] transition-colors cursor-pointer"
                >
                  Submit Another RFQ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      placeholder="e.g. Rajesh Khurana"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Business / Firm Name *</label>
                    <input 
                      type="text" 
                      name="businessName"
                      required
                      placeholder="e.g. Khurana Décor & Gift Emporium"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Business Category *</label>
                    <select 
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    >
                      <option>Retail Store / Dealer</option>
                      <option>Interior Designer / Architect</option>
                      <option>Corporate Gifting House</option>
                      <option>Hospitality / Hotel Chain</option>
                      <option>Export / Distributor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">GSTIN (Optional for initial quote)</label>
                    <input 
                      type="text" 
                      name="gstin"
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Business Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="procurement@store.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Primary Collection of Interest *</label>
                    <select 
                      name="collectionInterest"
                      value={formData.collectionInterest}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    >
                      <option>Decorative Tray Sets</option>
                      <option>Mango Wood Trays</option>
                      <option>Leatherette Trays & Organisers</option>
                      <option>Snack & Candy Sets</option>
                      <option>Crockery & Mugs</option>
                      <option>Festive & Gifting Sets</option>
                      <option>Corporate Gifting (Custom Branding)</option>
                      <option>Hotel / Cafe / HoReCa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Estimated Order Volume *</label>
                    <input 
                      type="text" 
                      name="orderVolume"
                      required
                      placeholder="e.g. 50 trays / 100 sets"
                      value={formData.orderVolume}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Delivery Destination (City / State) *</label>
                    <input 
                      type="text" 
                      name="destination"
                      required
                      placeholder="e.g. Mumbai / Jaipur / Surat"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Required Order Timeline</label>
                    <select 
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    >
                      <option>Immediate / Within 1 Week</option>
                      <option>Within 2 Weeks</option>
                      <option>Within 1 Month</option>
                      <option>Festive Season Planning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-800 mb-1.5">Specific Requirements or Custom Branding Notes</label>
                  <textarea 
                    name="notes"
                    rows="3"
                    placeholder="Mention if you require custom packaging boxes, sample kits, or wish to schedule a Karol Bagh showroom visit..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                  ></textarea>
                </div>

                {/* Form Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-[#3a2f24] text-white py-4 font-semibold text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer"
                  >
                    Send my request
                  </button>
                  <a 
                    href="https://wa.me/918459495594?text=Hello,%20I%20want%20to%20request%20wholesale%20pricing%20and%20dealer%20catalog."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white py-4 font-semibold text-xs uppercase tracking-[0.14em] transition-colors flex items-center justify-center text-center"
                  >
                    Or ask on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </FadeIn>

          {/* Right Column: contact + dealer advantages */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 mb-5">Talk to the trade desk</h3>
              <dl className="divide-y divide-stone-200 border-y border-stone-200 text-[15px]">
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Phone / WhatsApp</dt><dd><a href="tel:+918459495594" className="text-stone-900 font-medium">+91 84594 95594</a></dd></div>
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Email</dt><dd className="text-right"><a href="mailto:wholesale@divinehomeindia.com" className="text-stone-900 font-medium break-all">wholesale@divinehomeindia.com</a></dd></div>
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Showroom hours</dt><dd className="text-stone-900 text-right">Mon to Sat, 10:30 am to 8 pm</dd></div>
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Showroom</dt><dd className="text-stone-900 text-right">1st Floor, 15A/47, near Hotel Kyron, WEA, Karol Bagh, New Delhi 110005</dd></div>
              </dl>
              <a href="https://wa.me/918459495594" target="_blank" rel="noreferrer" className="mt-6 w-full border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center justify-center">
                Chat with the trade desk
              </a>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-stone-900 mb-5">Why dealers stock us</h3>
              <ul className="space-y-5">
                {[
                  ['Healthy retail margins', 'Trade pricing that leaves room for a proper retail margin, with MRP printed on request.'],
                  ['Pan-India delivery', 'Dispatch by transport or courier to every state, with a GST invoice.'],
                  ['See it before you order', 'Every design is on display at our Karol Bagh showroom.']
                ].map(([t, d]) => (
                  <li key={t} className="border-l-2 border-[#C5A059] pl-4">
                    <p className="text-[15px] font-semibold text-stone-900">{t}</p>
                    <p className="text-[15px] text-stone-600 leading-relaxed mt-0.5">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Wholesale & Dealer FAQs Section */}
        <section className="pt-14 sm:pt-20 border-t border-stone-200 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-[44px] leading-[1.1] text-stone-900 text-center mb-10">Questions dealers ask</h2>
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
                {openFaq === idx && <p className="text-[15px] text-stone-600 pb-6 -mt-1 leading-relaxed">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default WholesaleDealers;
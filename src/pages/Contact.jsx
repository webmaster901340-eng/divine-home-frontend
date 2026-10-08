import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../utils/api';
import { validateEmail, validateIndianPhone, formatPhoneInput } from '../utils/validation';

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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Wholesale & Dealer Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneInput(e.target.value);
    setFormData({...formData, phone: formatted});
    if (errors.phone) setErrors({...errors, phone: ''});
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, email: value});
    if (errors.email) setErrors({...errors, email: ''});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateIndianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const leadPayload = {
      name: formData.name,
      company: formData.subject,
      phone: formData.phone,
      email: formData.email,
      quantity: 'General Inquiry',
      city: 'Karol Bagh Desk',
      instructions: formData.message
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Error sending message: " + (data.error || "Please try again"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Failed to connect to server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Section */}
        <FadeIn direction="down" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-2">
            Karol Bagh Trade Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Contact Divine Home India
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
            Schedule a showroom visit in Karol Bagh, New Delhi or speak directly with our wholesale trade managers regarding dealer terms, festive catalogs, and bulk freight.
          </p>
        </FadeIn>

        {/* Main Grid Layout - Fixed vertical alignment using items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Showroom Office Card & Google Map (5 Columns) */}
          <FadeIn direction="left" className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Showroom & Trade Office Info Card */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 flex-grow">
              <h2 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                Showroom & Trade Office
              </h2>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <span className="text-base text-[#C5A059]">📍</span>
                  <div>
                    <strong className="text-stone-900 block font-medium uppercase text-[10px] tracking-wider">Wholesale Showroom:</strong>
                    <p className="leading-relaxed mt-0.5">Commercial Trade Zone, Karol Bagh, New Delhi, Delhi - 110005, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base text-[#C5A059]">📞</span>
                  <div>
                    <strong className="text-stone-900 block font-medium uppercase text-[10px] tracking-wider">Phone / WhatsApp Hotline:</strong>
                    <p className="font-semibold text-stone-900 mt-0.5">+91 98110 23456</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base text-[#C5A059]">✉️</span>
                  <div>
                    <strong className="text-stone-900 block font-medium uppercase text-[10px] tracking-wider">Dealer Procurement Email:</strong>
                    <p className="text-stone-900 mt-0.5">wholesale@divinehomeindia.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base text-[#C5A059]">⏰</span>
                  <div>
                    <strong className="text-stone-900 block font-medium uppercase text-[10px] tracking-wider">Showroom Hours:</strong>
                    <p className="mt-0.5">Mon – Sat: 10:30 AM – 8:00 PM IST</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://wa.me/919811023456?text=Hello,%20I%20want%20to%20schedule%20a%20showroom%20visit%20at%20Karol%20Bagh."
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#00A859] hover:bg-[#008f4c] text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer"
              >
                <span>💬</span> Chat on WhatsApp Trade Desk
              </a>
            </div>

            {/* Karol Bagh Map Card */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 pt-2 pb-3">
                <span className="font-serif text-xs font-bold text-stone-800">Karol Bagh Trade District, New Delhi</span>
                <a 
                  href="https://maps.google.com/?q=Karol+Bagh+New+Delhi" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
                >
                  Open in Maps ↗
                </a>
              </div>
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-stone-100">
                <iframe 
                  title="Karol Bagh Showroom Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14007.854124991256!2d77.1852!3d28.6519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0292408b0317%3A0xf64fefb3d6d53925!2sKarol%20Bagh%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </FadeIn>

          {/* Right Column: Direct Trade Inquiry Form (7 Columns) */}
          <FadeIn direction="right" className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100">
                Direct Trade Inquiry
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-3">
                  <h3 className="font-serif text-xl font-bold">Message Sent Successfully!</h3>
                  <p className="text-xs">Thank you, {formData.name}. Our Karol Bagh trade desk has received your inquiry and will respond within 2 business hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-stone-900 text-white text-xs uppercase px-6 py-2.5 rounded-xl font-semibold tracking-wider hover:bg-[#C5A059] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="e.g. Manish Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Email Address *</label>
                      <input
                        type="text"
                        name="email"
                        required
                        placeholder="procurement@brand.com"
                        value={formData.email}
                        onChange={handleEmailChange}
                        className={`w-full bg-stone-50 border rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Phone Number *</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full bg-stone-50 border rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Subject</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option>Wholesale & Dealer Inquiry</option>
                      <option>Showroom Visit Appointment</option>
                      <option>Corporate Gifting & Festive Catalog</option>
                      <option>Transit & Freight Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Your Message / Requirements *</label>
                    <textarea 
                      name="message"
                      rows="4"
                      required
                      placeholder="Tell us about your store location, product lines of interest, estimated quantities, and target timeline..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-4 rounded-xl font-semibold text-xs uppercase tracking-widest transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>✈</span> {loading ? 'SENDING...' : 'SEND MESSAGE TO TRADE DESK'}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

        </div>

      </div>
    </div>
  );
};

Contact.displayName = 'Contact';
export default Contact;
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
    <div className="min-h-screen bg-[#FBF9F5] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <h1 className="font-serif text-[34px] sm:text-5xl leading-[1.1] text-stone-900">
            Contact us
          </h1>
          <p className="text-[15px] sm:text-base text-stone-600 leading-relaxed mt-4">
            Visit the showroom, call or WhatsApp us. For prices, tell us your business type and city so we can send the right catalogue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Left: showroom details + map */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 mb-5">Showroom and trade office</h2>
              <dl className="divide-y divide-stone-200 border-y border-stone-200 text-[15px]">
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Address</dt><dd className="text-stone-900 text-right">1st Floor, 15A/47, near Hotel Kyron, WEA, Karol Bagh, New Delhi 110005</dd></div>
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Phone / WhatsApp</dt><dd><a href="tel:+918459495594" className="text-stone-900 font-medium">+91 84594 95594</a></dd></div>
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Email</dt><dd className="text-right"><a href="mailto:wholesale@divinehomeindia.com" className="text-stone-900 font-medium break-all">wholesale@divinehomeindia.com</a></dd></div>
                <div className="py-4 flex justify-between gap-4"><dt className="text-stone-500 shrink-0">Hours</dt><dd className="text-stone-900 text-right">Mon to Sat, 10:30 am to 8 pm</dd></div>
              </dl>
              <a
                href="https://wa.me/918459495594?text=Hello,%20I%20want%20to%20schedule%20a%20showroom%20visit%20at%20Karol%20Bagh."
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full bg-stone-900 hover:bg-[#3a2f24] text-white py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center justify-center"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 gap-4">
                <span className="text-[15px] text-stone-900">15A/47, WEA, Karol Bagh, New Delhi</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Divine+Home+India+Karol+Bagh+New+Delhi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-stone-900 underline underline-offset-4 decoration-stone-400 hover:decoration-stone-900 shrink-0"
                >
                  Open in Maps
                </a>
              </div>
              <div className="w-full h-64 overflow-hidden border border-stone-200">
                <iframe
                  title="Karol Bagh Showroom Map"
                  src="https://maps.google.com/maps?q=Divine%20Home%20India%2C%2015A%2F47%20WEA%20Karol%20Bagh%2C%20New%20Delhi%20110005&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right: enquiry form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-stone-200">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-2">
                Send us a message
              </h2>
              <p className="text-[15px] text-stone-600 mb-7">We usually reply within a few hours on working days.</p>

              {submitted ? (
                <div className="border border-stone-300 p-8 text-center space-y-3">
                  <h3 className="font-serif text-2xl text-stone-900">Thank you, message sent</h3>
                  <p className="text-[15px] text-stone-600">Thank you, {formData.name}. Our Karol Bagh trade desk has received your inquiry and will respond within 2 business hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white text-xs uppercase px-6 py-3 font-semibold tracking-[0.14em] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="e.g. Manish Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-stone-800 mb-1.5">Email Address *</label>
                      <input
                        type="text"
                        name="email"
                        required
                        placeholder="procurement@brand.com"
                        value={formData.email}
                        onChange={handleEmailChange}
                        className={`w-full bg-white border px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-stone-900'
                        }`}
                      />
                      {errors.email && <p className="text-sm text-red-700 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800 mb-1.5">Phone Number *</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full bg-white border px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-stone-900'
                        }`}
                      />
                      {errors.phone && <p className="text-sm text-red-700 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Subject</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    >
                      <option>Wholesale & Dealer Inquiry</option>
                      <option>Showroom Visit Appointment</option>
                      <option>Corporate Gifting & Festive Catalog</option>
                      <option>Transit & Freight Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Your Message / Requirements *</label>
                    <textarea 
                      name="message"
                      rows="4"
                      required
                      placeholder="Tell us about your store location, product lines of interest, estimated quantities, and target timeline..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 px-4 py-3.5 text-base sm:text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 hover:bg-[#3a2f24] text-white py-4 font-semibold text-xs uppercase tracking-[0.14em] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

Contact.displayName = 'Contact';
export default Contact;
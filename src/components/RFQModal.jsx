import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/api';
import { validateEmail, validateIndianPhone, formatPhoneInput } from '../utils/validation';

const RFQModal = ({ isOpen, onClose, productTitle = '', cartItems = [] }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    quantity: '',
    pincode: '',
    notes: productTitle ? `Interested in: ${productTitle}` : ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !validateIndianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const productsInfo = cartItems.length > 0
      ? cartItems.map(item => `${item.title} (Qty: ${item.quantity || 1})`).join(', ')
      : productTitle;

    const leadPayload = {
      name: formData.fullName,
      company: formData.businessName || 'N/A',
      phone: formData.phone,
      email: formData.email || 'N/A',
      quantity: cartItems.length > 0 ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) : formData.quantity,
      city: formData.pincode,
      instructions: `Products: ${productsInfo}\n\nAdditional Notes: ${formData.notes}`
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
        alert("Error submitting RFQ: " + (data.error || "Please try again"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Failed to connect to server. Make sure your backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold text-xs transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
            B2B WHOLESALE TRADE DESK
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Wholesale Bulk Enquiry
          </h2>
          {cartItems.length > 0 ? (
            <div className="mt-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-2">Items in Quotation:</p>
              <div className="space-y-1">
                {cartItems.map((item, idx) => (
                  <p key={idx} className="text-xs text-stone-700">
                    • {item.title} (Qty: {item.quantity || 1})
                  </p>
                ))}
              </div>
            </div>
          ) : productTitle && (
            <p className="text-xs text-[#C5A059] mt-1 font-medium">
              Item: {productTitle}
            </p>
          )}
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
            <h3 className="font-serif text-lg font-bold">RFQ Submitted Successfully!</h3>
            <p className="text-xs">Thank you, {formData.fullName}. Our Karol Bagh trade desk will review your inquiry and connect with your wholesale price sheet within 2 business hours.</p>
            <button 
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-3 bg-stone-900 text-white text-xs uppercase px-5 py-2 rounded-xl font-semibold hover:bg-[#C5A059] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Your Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Company / Retail Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Roastery Café & Kitchen"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full bg-stone-50 border rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-[#C5A059]'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Business Email</label>
                <input
                  type="text"
                  placeholder="procurement@brand.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={`w-full bg-stone-50 border rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-[#C5A059]'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Estimated Quantity Required *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 50 sets / 250 pcs"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Delivery City / Pincode *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mumbai, 400001"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Customization or Special Instructions</label>
              <textarea 
                rows="2"
                placeholder="Need custom logo branding, specific glaze, or delivery details..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a 
                href={`https://wa.me/919811023456?text=Hello,%20I%20want%20to%20request%20wholesale%20quote%20for%20${encodeURIComponent(productTitle || 'Bulk Order')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer shadow-sm"
              >
                <span>💬</span> Instant WhatsApp Quote
              </a>

              <button 
                type="submit"
                disabled={loading}
                className="bg-stone-900 hover:bg-[#C5A059] text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Submitting...' : '✓ Submit RFQ Request'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

RFQModal.displayName = 'RFQModal';
export default RFQModal;
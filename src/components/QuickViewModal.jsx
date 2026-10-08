import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

const QuickViewModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [showRFQForm, setShowRFQForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    quantity: product?.moq || '30 pcs',
    pincode: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const leadPayload = {
      name: formData.fullName,
      company: formData.businessName || 'Quick View Retail',
      phone: formData.phone,
      email: formData.email || 'N/A',
      quantity: formData.quantity,
      city: formData.pincode,
      instructions: `Item: ${product.title} (SKU: ${product.sku}). Note: ${formData.notes}`
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
      alert("Failed to connect to server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-stone-200 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
        >
          ✕
        </button>

        {showRFQForm ? (
          /* RFQ FORM VIEW INSIDE MODAL */
          <div className="w-full p-6 md:p-8">
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
                B2B WHOLESALE TRADE DESK
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Request Formal Quotation
              </h2>
              <p className="text-xs text-[#C5A059] mt-1 font-medium">
                Item: {product.title} (SKU: {product.sku})
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <h3 className="font-serif text-lg font-bold">RFQ Submitted Successfully!</h3>
                <p className="text-xs">Thank you, {formData.fullName}. Our Karol Bagh trade desk will review your inquiry and connect with your wholesale price sheet within 2 business hours.</p>
                <button 
                  onClick={() => { setSubmitted(false); setShowRFQForm(false); onClose(); }}
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
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Business Email</label>
                    <input 
                      type="email" 
                      placeholder="procurement@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Quantity Required *</label>
                    <input 
                      type="text" 
                      required
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
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Special Instructions</label>
                  <textarea 
                    rows="2"
                    placeholder="Custom branding, packaging notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowRFQForm(false)}
                    className="w-1/3 bg-stone-200 hover:bg-stone-300 text-stone-800 py-3 rounded-xl font-bold uppercase transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-stone-900 hover:bg-[#C5A059] text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'SUBMITTING...' : '✓ Submit RFQ Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* NORMAL QUICK VIEW VIEW */
          <>
            {/* Left: Product Image */}
            <div className="w-full md:w-1/2 bg-stone-100 relative h-72 md:h-auto">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-[#C5A059] text-white text-[10px] uppercase px-3 py-1 rounded tracking-widest font-semibold shadow-sm">
                  {product.badge}
                </span>
              )}
              <img 
                src={product.images && product.images[0] ? product.images[0] : product.image} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Product Details & Wholesale Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-medium">
                  <span>{product.category}</span>
                  <span>SKU: {product.sku}</span>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-3 leading-snug">
                  {product.title}
                </h2>

                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-stone-900 text-white text-[11px] px-3 py-1 rounded-md uppercase tracking-wider font-medium">
                    MOQ: {product.moq}
                  </span>
                  {product.material && (
                    <span className="bg-stone-100 text-stone-700 text-[11px] px-3 py-1 rounded-md border border-stone-200">
                      {product.material}
                    </span>
                  )}
                </div>

                {/* Wholesale Pricing Tier */}
                <div className="bg-[#F9F7F2] p-4 rounded-xl border border-stone-200/80 mb-6">
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider font-semibold block mb-1">WHOLESALE PRICING TIER</span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-sans text-3xl font-bold text-stone-900 tracking-tight">₹{product.wholesalePrice || product.price}</span>
                    <span className="text-sm text-stone-400 line-through">₹{product.mrp}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold ml-auto">Direct Factory Price</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <a 
                  href={`https://wa.me/919811023456?text=Hello,%20I%20want%20to%20inquire%20about%20wholesale%20for%20${product.title}%20(SKU:%20${product.sku})`}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer text-center"
                >
                  <span>💬</span> Inquire via WhatsApp
                </a>

                {/* Request Formal Quotation Button */}
                <button 
                  onClick={() => setShowRFQForm(true)}
                  className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-3 rounded-xl font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
                >
                  ✦ Request Formal Quotation
                </button>
                
                {/* View Full Detail Button (Fixed with useNavigate to prevent Preloader trigger) */}
                <button 
                  onClick={() => {
                    onClose();
                    navigate(`/product/${product._id}`);
                  }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>✦</span> View Full Detail & Specifications →
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

QuickViewModal.displayName = 'QuickViewModal';
export default QuickViewModal;
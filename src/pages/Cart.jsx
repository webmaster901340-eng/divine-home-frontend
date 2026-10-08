import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { API_BASE_URL } from '../utils/api';
import Toast from '../components/Toast';
import { validateEmail, validateIndianPhone, formatPhoneInput } from '../utils/validation';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);
  const [isRFQOpen, setIsRFQOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [quotationForm, setQuotationForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    estimatedQuantity: '',
    specialInstructions: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneInput(e.target.value);
    setQuotationForm(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({...prev, phone: ''}));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setQuotationForm(prev => ({ ...prev, email: value }));
    if (errors.email) setErrors(prev => ({...prev, email: ''}));
  };

  const generateCartSummary = () => {
    return cart.map(item =>
      `🛍️ ${item.designName || item.title}
   Design: ${item.designNo || 'N/A'}
   SKU: ${item.sku}
   Category: ${item.category}
   Series: ${item.series || 'Elite Series'}
   Material: ${item.specs?.material || item.material || 'N/A'}
   Finish: ${item.specs?.finish || 'N/A'}
   Dimensions: ${item.specs?.dimensions || 'N/A'}
   Wholesale Price: ₹${item.wholesalePrice}/unit
   Qty: ${item.quantity}
   Total: ₹${item.wholesalePrice * item.quantity}
   MOQ: ${item.moq}`
    ).join('\n\n');
  };

  // 1. Submit RFQ Request -> ONLY sends data to Admin Panel (Database API)
  const handleRequestQuotation = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (quotationForm.email && !validateEmail(quotationForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (quotationForm.phone && !validateIndianPhone(quotationForm.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (
      !quotationForm.name.trim() ||
      !quotationForm.phone.trim() ||
      !quotationForm.city.trim() ||
      !quotationForm.estimatedQuantity.trim()
    ) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    if (cart.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const leadPayload = {
        name: quotationForm.name,
        company: quotationForm.company || 'Cart RFQ Lead',
        phone: quotationForm.phone,
        email: quotationForm.email || 'N/A',
        quantity: quotationForm.estimatedQuantity || `${cart.reduce((sum, item) => sum + item.quantity, 0)} units`,
        city: quotationForm.city,
        instructions: `[BULK_CART_RFQ]\nQUOTATION REQUEST:\n\n${generateCartSummary()}\n\nSpecial Instructions: ${quotationForm.specialInstructions || 'None'}\n\nTotal Price: ₹${getTotalPrice()}`,
        leadType: 'bulk-cart',
        cartItems: cart.map(item => ({
          productId: item._id,
          title: item.designName || item.title,
          designNo: item.designNo || '',
          sku: item.sku || '',
          category: item.category || '',
          series: item.series || '',
          material: item.specs?.material || item.material || '',
          finish: item.specs?.finish || '',
          dimensions: item.specs?.dimensions || '',
          wholesalePrice: Number(item.wholesalePrice) || 0,
          quantity: item.quantity,
          moq: item.moq || ''
        })),
        totalPrice: getTotalPrice()
      };

      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.details || result?.error || `Request failed (${response.status})`);
      }

      setToast({ message: 'Quotation request submitted successfully to Admin Panel!', type: 'success' });

      // Clear cart and form after successful backend submission
      clearCart();
      setQuotationForm({ name: '', company: '', email: '', phone: '', city: '', estimatedQuantity: '', specialInstructions: '' });
      setTimeout(() => setIsRFQOpen(false), 1500);

    } catch (err) {
      console.error("RFQ Submit Error:", err);
      setToast({
        message: err.message === 'Failed to fetch'
          ? 'Could not reach the RFQ backend. Check the backend URL, server, and CORS configuration.'
          : `Could not save RFQ: ${err.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Instant WhatsApp Quote -> Opens WhatsApp with prefilled message
  const handleWhatsAppQuote = () => {
    if (!quotationForm.name || !quotationForm.phone || !quotationForm.city) {
      setToast({ message: 'Please fill Name, Phone and City for WhatsApp quote', type: 'error' });
      return;
    }

    const whatsappMessage = `Hello! I would like to request a quotation for the following products:\n\n*QUOTATION REQUEST*\n━━━━━━━━━━━━━━━━━━━\n\n*Customer Details:*\n👤 Name: ${quotationForm.name}\n🏢 Company: ${quotationForm.company || 'N/A'}\n📱 Phone: ${quotationForm.phone}\n🏙️ City: ${quotationForm.city}\n\n*CART ITEMS (${cart.length} products):*\n━━━━━━━━━━━━━━━━━━━\n\n${generateCartSummary()}\n\n*REQUEST DETAILS:*\nEstimated Quantity: ${quotationForm.estimatedQuantity}\nSpecial Instructions: ${quotationForm.specialInstructions || 'None'}\n\n*TOTAL:*\n━━━━━━━━━━━━━━━━━━━\n📦 Total Items: ${cart.length}\n🔢 Total Quantity: ${cart.reduce((sum, item) => sum + item.quantity, 0)} units\n💰 Total Price: ₹${getTotalPrice()}\n\nPlease provide a detailed quotation and lead time. Thank you!`;

    window.open(`https://wa.me/919811023456?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-4">Your Cart</h1>
          <p className="text-stone-600 text-lg mb-8">Your cart is empty. Start adding products!</p>
          <Link
            to="/collections"
            className="inline-block bg-[#C5A059] hover:bg-[#B8934A] text-white py-3 px-8 rounded-xl font-semibold transition-colors"
          >
            Browse Collections
          </Link>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item._id} className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-6 flex gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae'}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-serif text-lg sm:text-xl font-bold text-stone-900 hover:text-[#C5A059] transition-colors"
                  >
                    {item.designName || item.title}
                  </Link>
                  <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">{item.category}</p>
                  <p className="text-sm text-stone-600 mt-1">SKU: {item.sku}</p>
                  <p className="text-sm text-stone-600 mt-1">Series: {item.series || 'Elite Series'}</p>

                  <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
                    <div>
                      <span className="font-sans text-xl font-bold text-stone-900 tracking-tight">₹{item.wholesalePrice}</span>
                      <span className="text-xs text-stone-400 ml-2">per unit</span>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2 border border-stone-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 text-stone-600 hover:text-stone-900 transition-colors font-semibold"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-semibold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 text-stone-600 hover:text-stone-900 transition-colors font-semibold"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Total for Item */}
                <div className="text-right">
                  <p className="text-xs text-stone-500 mb-1">Subtotal</p>
                  <p className="font-sans text-1xl sm:text-1xl font-bold text-stone-900 tracking-tight">
                    ₹{(item.wholesalePrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sticky top-24 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Order Summary</h2>

                <div className="space-y-3 pb-4 border-b border-stone-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Items:</span>
                    <span className="font-semibold text-stone-900">{cart.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Total Units:</span>
                    <span className="font-semibold text-stone-900">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>

                <div className="py-4 border-b border-stone-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-stone-900">Total:</span>
                    <span className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsRFQOpen(true)}
                className="w-full bg-[#C5A059] hover:bg-[#B8934A] text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors shadow-md cursor-pointer"
              >
                REQUEST QUOTATION
              </button>

              <Link
                to="/collections"
                className="block w-full text-center bg-stone-100 hover:bg-stone-200 text-stone-900 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors"
              >
                CONTINUE SHOPPING
              </Link>

              <div className="pt-4 border-t border-stone-200/80 text-xs text-stone-500 space-y-2">
                <div className="flex items-start gap-2">
                  <span>🛡️</span>
                  <span>100% Bespoke Quality & Export Finish Guarantee</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>📦</span>
                  <span>Safe transit insured multi-layer packing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RFQ Modal */}
      {isRFQOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative flex flex-col p-6 sm:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsRFQOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors z-30 cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Body */}
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold mb-1">
                B2B WHOLESALE TRADE DESK
              </p>
              
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-4 pr-10">
                Wholesale Bulk Enquiry
              </h2>

              <div className="bg-stone-50/80 border border-stone-200 rounded-2xl p-3 mb-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-600 mb-1.5">
                  ITEMS IN QUOTATION:
                </p>
                <ul className="space-y-0.5">
                  {cart.map((item) => (
                    <li key={item._id} className="text-xs text-stone-700 font-medium">
                      • {item.designName || item.title} (Qty: {item.quantity})
                    </li>
                  ))}
                </ul>
              </div>

              <form id="cart-rfq-form" onSubmit={handleRequestQuotation} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={quotationForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      COMPANY / RETAIL NAME
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={quotationForm.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Roastery Café & Kitchen"
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      PHONE / WHATSAPP *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={quotationForm.phone}
                      onChange={handlePhoneChange}
                      placeholder="+91 98765 43210"
                      className={`w-full bg-stone-50/50 border rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-[#C5A059]'
                      }`}
                      required
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      BUSINESS EMAIL
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={quotationForm.email}
                      onChange={handleEmailChange}
                      placeholder="procurement@brand.com"
                      className={`w-full bg-stone-50/50 border rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-[#C5A059]'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      ESTIMATED QUANTITY REQUIRED *
                    </label>
                    <input
                      type="text"
                      name="estimatedQuantity"
                      value={quotationForm.estimatedQuantity}
                      onChange={handleInputChange}
                      placeholder="e.g. 50 sets / 250 pcs"
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      DELIVERY CITY / PINCODE *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={quotationForm.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai, 400001"
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    CUSTOMIZATION OR SPECIAL INSTRUCTIONS
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={quotationForm.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Need custom logo branding, specific glaze, or delivery details..."
                    rows="2"
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Button Bar */}
            <div className="pt-4 mt-3 border-t border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppQuote}
                  className="bg-[#00B060] hover:bg-[#009b55] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer"
                >
                  <span>💬</span> INSTANT WHATSAPP QUOTE
                </button>

                <button
                  type="submit"
                  form="cart-rfq-form"
                  disabled={loading}
                  className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>✓</span> {loading ? 'SUBMITTING...' : 'SUBMIT RFQ REQUEST'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Cart;
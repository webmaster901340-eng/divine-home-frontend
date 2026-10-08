import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCartNotice, setShowCartNotice] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setShowCartNotice(true);
    setTimeout(() => setShowCartNotice(false), 2000);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between w-full min-h-[420px]"
      >
        {/* Top Image & Hover Overlay */}
        <div className="relative h-56 overflow-hidden bg-stone-100 shrink-0">
          {product.badge && (
            <span className="absolute top-3 left-3 z-10 bg-[#C5A059] text-white text-[10px] uppercase px-2.5 py-1 rounded tracking-widest font-semibold shadow-sm">
              {product.badge}
            </span>
          )}
          <span className="absolute top-3 right-3 z-10 bg-stone-900/80 backdrop-blur-md text-white text-[10px] uppercase px-2.5 py-1 rounded tracking-wider">
            MOQ: {product.moq}
          </span>

          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Hover Overlay Content */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center gap-2 p-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold py-2 px-3 rounded-lg shadow-lg flex items-center gap-1 transition-transform flex-1 justify-center"
              >
                <span className="text-stone-600">👁</span><span className="hidden sm:inline">QUICK VIEW</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="bg-[#C5A059] hover:bg-[#B8934F] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-lg flex items-center gap-1 transition-transform flex-1 justify-center"
              >
                <span>🛒</span><span className="hidden sm:inline">ADD TO CART</span>
              </button>

              <a
                href={`https://wa.me/919811023456?text=${encodeURIComponent(`Hi! I'm interested in: ${product.designName || product.title}\n\n📋 Product Details:\n• Design: ${product.designName || product.title}\n• Category: ${product.category}\n• Series: ${product.series || 'Elite Series'}\n• SKU: ${product.sku}\n• Design No: ${product.designNo || 'N/A'}\n• Wholesale Price: ₹${product.wholesalePrice}\n• MRP: ₹${product.mrp}\n• MOQ: ${product.moq}\n• Material: ${product.specs?.material || 'N/A'}\n\nPlease provide more details and pricing.`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-9 h-9 rounded-lg flex items-center justify-center shadow-lg transition-transform hover:scale-110 flex-shrink-0"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

              {showCartNotice && (
                <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center">
                  ✓ Added to cart!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex justify-between items-center text-[10px] text-stone-400 uppercase tracking-widest mb-1 font-medium">
              <span className="w-full">{product.category}</span>
              <span className="shrink-0 ml-2">SKU: {product.sku}</span>
            </div>
            <h3
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/collections?design=${encodeURIComponent(product.designName || product.title)}`);
              }}
              className="font-serif text-stone-900 font-bold text-sm mb-2 line-clamp-1 group-hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              {product.designName || product.title}
            </h3>
          </div>

          {/* Price & Enquire Bar with Strong Button Affordance */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-stone-400 uppercase tracking-wider font-semibold">WHOLESALE TIER</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-sans font-bold text-stone-900 text-base leading-none">₹{product.wholesalePrice}</span>
                <span className="text-xs text-stone-400 line-through font-sans leading-none">₹{product.mrp}</span>
              </div>
            </div>
            <a
              href={`https://wa.me/919811023456?text=${encodeURIComponent(`Hello! I would like to inquire about a wholesale product:\n\n📦 PRODUCT INQUIRY\n━━━━━━━━━━━━━━━━━━━\n🎨 Design: ${product.designName || product.title}\n📂 Category: ${product.category}\n🏷️ Series: ${product.series || 'Elite Series'}\n📍 SKU: ${product.sku}\n🔢 Design No: ${product.designNo || 'N/A'}\n\n💰 PRICING\n━━━━━━━━━━━━━━━━━━━\n💵 Wholesale Price: ₹${product.wholesalePrice}\n🏷️ MRP: ₹${product.mrp}\n📦 MOQ: ${product.moq}\n\n🔧 SPECIFICATIONS\n━━━━━━━━━━━━━━━━━━━\n🪨 Material: ${product.specs?.material || 'N/A'}\n✨ Finish: ${product.specs?.finish || 'N/A'}\n📏 Dimensions: ${product.specs?.dimensions || 'N/A'}\n⚖️ Weight: ${product.specs?.weight || 'N/A'}\n📦 Packaging: ${product.specs?.packaging || 'N/A'}\n\nPlease provide more information and current availability. Thank you!`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-900 hover:bg-[#C5A059] text-white text-[11px] px-4 py-2 rounded-xl font-semibold tracking-wider uppercase transition-colors duration-300 flex items-center gap-1 shadow-sm shrink-0"
            >
              ENQUIRE &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Render Quick View Modal when triggered */}
      {showModal && (
        <QuickViewModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ProductCard;
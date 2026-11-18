import { productPath } from '../utils/slug';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuickViewModal from './QuickViewModal';

const FALLBACK = '/images/dhi/mango-wood-trays.jpg';

// D2C-style product tile: square photo on a warm backdrop, second photo fades in on hover,
// quiet type underneath. No borders/boxes, no prices.
const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const imgs = (product.images || []).filter(Boolean);
  const first = imgs[0] || FALLBACK;
  const second = imgs[1];
  const to = productPath(product);
  const series = product.series || product.category;

  const waText = `Hi! I'd like dealer pricing for ${product.designName || product.title} (${product.sku}).`;

  return (
    <>
      <div className="group w-full">
        <Link to={to} className="block relative aspect-square overflow-hidden bg-[#F3EEE6] rounded-md">
          <img
            src={first}
            alt={`${product.title} by Divine Home India`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${second ? 'group-hover:opacity-0' : ''}`}
          />
          {second && (
            <img
              src={second}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}

          {product.badge && (
            <span className="absolute top-3 left-3 bg-white/90 text-stone-800 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm">
              {product.badge}
            </span>
          )}

          {/* Desktop hover actions */}
          <div className="hidden md:flex absolute inset-x-3 bottom-3 gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setShowModal(true); }}
              className="flex-1 bg-white/95 hover:bg-white text-stone-900 text-[11px] uppercase tracking-[0.16em] py-2.5 rounded-sm"
            >
              Quick view
            </button>
          </div>
        </Link>

        <div className="pt-3 sm:pt-4">
          {series && (
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#8a6a2f] mb-1.5 line-clamp-1">{series}</p>
          )}
          <h3 className="font-serif text-stone-900 text-[15px] sm:text-[17px] leading-snug line-clamp-2 min-h-[2.6em]">
            <Link to={to} className="hover:text-[#8a6a2f] transition-colors">
              {product.title}
            </Link>
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-stone-200 pt-2">
            <span className="text-[11px] sm:text-xs text-stone-500">Dealer price on request</span>
            <a
              href={`https://wa.me/918459495594?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-stone-900 hover:text-[#8a6a2f]"
            >
              Enquire →
            </a>
          </div>
        </div>
      </div>

      {showModal && <QuickViewModal product={product} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ProductCard;

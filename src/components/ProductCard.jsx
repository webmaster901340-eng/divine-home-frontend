import { productPath } from '../utils/slug';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuickViewModal from './QuickViewModal';

const FALLBACK = '/images/dhi/mango-wood-trays.jpg';

// Premium D2C product tile: tall photo on a warm backdrop, second photo on hover,
// clear sans title, quiet series line and one clear call to action. No prices.
const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const imgs = (product.images || []).filter(Boolean);
  const first = imgs[0] || FALLBACK;
  const second = imgs[1];
  const to = productPath(product);
  const series = product.series || product.category;
  const waText = `Hi! I'd like dealer pricing for ${product.title} (${product.sku}).`;

  return (
    <>
      <article className="group w-full flex flex-col h-full">
        <Link to={to} className="block relative aspect-[4/5] overflow-hidden bg-[#EFE9DF]">
          <img
            src={first}
            alt={`${product.title} by Divine Home India`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-[900ms] ease-out group-hover:scale-[1.04] ${second ? 'group-hover:opacity-0' : ''}`}
          />
          {second && (
            <img
              src={second}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-[900ms] ease-out group-hover:opacity-100"
            />
          )}

          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#FBF9F5] text-stone-900 text-[11px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1">
              {product.badge}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowModal(true); }}
            className="hidden md:block absolute inset-x-0 bottom-0 bg-[#FBF9F5]/95 text-stone-900 text-xs font-semibold uppercase tracking-[0.14em] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            Quick view
          </button>
        </Link>

        <div className="pt-4 flex flex-col flex-1">
          {series && (
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500 mb-1.5 line-clamp-1">{series}</p>
          )}
          <h3 className="font-sans text-stone-900 text-[15px] sm:text-base font-medium leading-snug line-clamp-2">
            <Link to={to} className="hover:underline underline-offset-4 decoration-stone-300">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-[13px] text-stone-500">Trade price on request</p>

          <a
            href={`https://wa.me/918459495594?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-auto pt-4"
          >
            <span className="block w-full text-center border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors text-xs font-semibold uppercase tracking-[0.14em] py-3">
              <span className="sm:hidden">Get price</span><span className="hidden sm:inline">Get dealer price</span>
            </span>
          </a>
        </div>
      </article>

      {showModal && <QuickViewModal product={product} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ProductCard;

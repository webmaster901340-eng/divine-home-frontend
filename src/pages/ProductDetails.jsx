import React, { useState, useEffect, useRef, useContext } from 'react';
import { priceLabel, mrpLabel, hasPrice } from '../utils/price';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import RFQModal from '../components/RFQModal';
import { CartContext } from '../context/CartContext';
import { API_BASE_URL } from '../utils/api';
import { productPath, productSlug } from '../utils/slug';
import { applyHead, setJsonLd } from '../components/Seo';
import { productHead, productSchema } from '../seo/pages';

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

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  // Zoom Effect State for High-Res Image
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isRFQOpen, setIsRFQOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        // New links use the title slug; old links used the Mongo _id, so accept both.
        const found = list.find(p => productSlug(p) === id || String(p._id) === String(id)) || null;
        setProduct(found);
        setSelectedImage(0);
        if (found) {
          const sameCategory = list.filter(p => p._id !== found._id && p.category === found.category);
          const others = list.filter(p => p._id !== found._id && p.category !== found.category);
          setRelatedProducts([...sameCategory, ...others].slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching catalog:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const path = productPath(product);
    applyHead(productHead(product, path));
    setJsonLd('product-ld', productSchema(product, path));
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="font-serif text-stone-500 text-lg animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <meta name="robots" content="noindex" />
        <h1 className="font-serif text-2xl font-bold text-stone-900">This product is no longer in our catalogue</h1>
        <p className="text-sm text-stone-600">It may have been renamed or discontinued. Browse the current range or WhatsApp us on +91 84594 95594.</p>
        <Link to="/collections" className="bg-stone-900 hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full">View catalogue</Link>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Wholesale from Divine Home India: ${product.title}`,
        url: currentUrl,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert('Product link copied to clipboard!');
    }
  };

  const handleDownloadSpecSheet = () => {
    const specContent = `
DIVINE HOME INDIA - WHOLESALE SPEC SHEET

Product: ${product.title}
SKU: ${product.sku || "DHI-SKU"}
Category: ${product.category}
Wholesale Rate: ${hasPrice(product.wholesalePrice) ? `₹${product.wholesalePrice}/unit` : "On request"}
MOQ: ${product.moq || "On request"}

TECHNICAL SPECIFICATIONS:
MATERIAL: ${product.specs?.material || "See catalogue"}
FINISH: ${product.specs?.finish || "See catalogue"}
DIMENSIONS: ${product.specs?.dimensions || "As per master catalog"}
WEIGHT: ${product.specs?.weight || "Standard"}
PACKAGING: ${product.specs?.packaging || "Corrugated carton with bubble wrap"}

CONTACT TRADE DESK:
WhatsApp: +91 84594 95594
Email: wholesale@divinehomeindia.com
1st Floor, 15A/47, near Hotel Kyron, WEA, Karol Bagh, New Delhi 110005
    `.trim();

    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.sku || 'Spec_Sheet'}_Wholesale_Spec.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-stone-200/80 shadow-sm p-4 sm:p-10 mb-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pb-8 sm:pb-12 border-b border-stone-200">
          
          {/* Left Column: Thumbnails + High-Res Interactive Zoom Main Image */}
          <FadeIn direction="left" className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
              {product.images && product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-16 sm:w-16 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === idx ? 'border-[#C5A059] shadow-md scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.title} photo ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* High-Resolution Interactive Zoom Container */}
            <div 
              className="relative flex-1 h-[320px] sm:h-[460px] rounded-2xl overflow-hidden bg-stone-900 shadow-xl cursor-crosshair group w-full"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
                <span className="bg-[#C5A059] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-md shadow">
                  {product.badge || 'Ellite Series'}
                </span>
              </div>

              <img 
                src={product.images && product.images[selectedImage] ? product.images[selectedImage] : product.image} 
                alt={product.title} 
                className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
              />

              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/20 pointer-events-none">
                {isZoomed ? 'Move to inspect details' : '🔍 Hover to zoom'}
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Product Info & Pricing */}
          <FadeIn direction="right" className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs uppercase tracking-[0.15em] text-stone-500 font-semibold mb-1">
                <span>{product.category}</span>
                <span className="text-stone-400">SKU: {product.sku || "DHI-SKU"}</span>
              </div>
              <h1 className="font-serif text-xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                <span className="text-stone-600 font-medium">{product.series}{product.designNo ? ` · Design ${product.designNo}` : ""}</span>
                <span className="text-stone-300">•</span>
                <span className="text-emerald-700 font-medium">✓ Dispatched from Karol Bagh, New Delhi</span>
              </div>
            </div>

            {/* Indicative Wholesale Tier Box */}
            <div className="bg-[#FAFAFA] p-4 sm:p-5 rounded-2xl border border-stone-200/80 relative">
              <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-900 text-[10px] uppercase font-semibold px-2.5 py-1 rounded-md">
                Commercial Rate
              </div>

              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block mb-1">
                Indicative Wholesale Tier
              </span>

              <div className="flex items-baseline gap-3">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {priceLabel(product.wholesalePrice)}
                </span>
                {hasPrice(product.wholesalePrice) && <span className="text-xs text-stone-500 font-light">/ unit</span>}
                <span className="text-xs text-stone-400 line-through">{hasPrice(product.mrp) ? `MRP ${mrpLabel(product.mrp)}` : ""}</span>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-200/60 text-xs">
                <span className="text-stone-600 font-light">Minimum Order Quantity (MOQ):</span>
                <strong className="text-stone-900 font-semibold">{product.moq || "On request"}</strong>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Action Buttons (Clear Visual Hierarchy) */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Primary Action: Add to Cart */}
                <button
                  onClick={() => {
                    addToCart(product);
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                  }}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer ${
                    addedToCart
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#C5A059] hover:bg-[#B8934A] text-white'
                  }`}
                >
                  <span>{addedToCart ? '✓' : '🛒'}</span> {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                </button>

                {/* Secondary Action: WhatsApp Enquiry */}
                <a
                  href={`https://wa.me/918459495594?text=Hello,%20I%20want%20to%20enquire%20about%20wholesale%20order%20for%20${encodeURIComponent(product.title)}%20(SKU:%20${product.sku})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#00A859] hover:bg-[#008f4c] text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer"
                >
                  <span>💬</span> Enquire on WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleDownloadSpecSheet}
                  className="flex-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>📥</span> Download Spec Sheet
                </button>

                <button
                  onClick={handleShare}
                  className="flex-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>🔗</span> Share Product
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-stone-600 border-t border-stone-200/80">
              <div className="flex items-center gap-2"><span>🛡️</span> Every design on display at our Karol Bagh showroom</div>
              <div className="flex items-center gap-2"><span>📦</span> Packed in corrugated cartons with bubble wrap</div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom Section: Technical Specifications (Balanced Grid) */}
        <FadeIn direction="up" className="pt-8 sm:pt-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-2">
            Specifications
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-6">
            Product details and packing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-stone-200/80 flex justify-between items-center text-xs">
              <span className="text-stone-500 uppercase font-semibold text-[11px]">Material / Series</span>
              <span className="text-stone-900 font-medium text-right">{product.specs?.material || product.series || "See catalogue"}</span>
            </div>
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-stone-200/80 flex justify-between items-center text-xs">
              <span className="text-stone-500 uppercase font-semibold text-[11px]">Finish</span>
              <span className="text-stone-900 font-medium text-right">{product.specs?.finish || "See catalogue"}</span>
            </div>
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-stone-200/80 flex justify-between items-center text-xs">
              <span className="text-stone-500 uppercase font-semibold text-[11px]">Dimensions</span>
              <span className="text-stone-900 font-medium text-right">{product.specs?.dimensions || "See catalogue"}</span>
            </div>
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-stone-200/80 flex justify-between items-center text-xs">
              <span className="text-stone-500 uppercase font-semibold text-[11px]">Weight</span>
              <span className="text-stone-900 font-medium text-right">{product.specs?.weight || "On request"}</span>
            </div>
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-stone-200/80 flex justify-between items-center text-xs sm:col-span-2">
              <span className="text-stone-500 uppercase font-semibold text-[11px]">Master Packaging</span>
              <span className="text-stone-900 font-medium text-right">{product.specs?.packaging || "Corrugated carton with bubble wrap"}</span>
            </div>
          </div>
        </FadeIn>

      </div>

      {/* Frequently Paired Wholesale Items */}
      {relatedProducts.length > 0 && (
        <FadeIn direction="up" className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-1">
                More from the catalogue
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Dealers also order
              </h2>
            </div>
            <Link to="/collections" className="text-xs font-semibold text-stone-900 hover:text-[#C5A059] transition-colors shrink-0">
              View More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <div key={item._id} className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* RFQ MODAL */}
      <RFQModal 
        isOpen={isRFQOpen} 
        onClose={() => setIsRFQOpen(false)} 
        productTitle={`${product.title} (SKU: ${product.sku || 'N/A'})`} 
      />
    </div>
  );
};

ProductDetail.displayName = 'ProductDetail';
export default ProductDetail;
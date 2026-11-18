import React, { useState, useEffect, useRef, useContext } from 'react';
import { priceLabel, mrpLabel, hasPrice } from '../utils/price';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductGallery from '../components/ProductGallery';
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
      <div className="max-w-6xl mx-auto mb-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pb-8 sm:pb-12 border-b border-stone-200">
          
          {/* Left Column: product photo carousel */}
          <FadeIn direction="left" className="lg:col-span-6">
            <ProductGallery images={product.images?.length ? product.images : [product.image]} title={product.title} />
          </FadeIn>

          {/* Right Column: Product Info & Pricing */}
          <FadeIn direction="right" className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs uppercase tracking-[0.15em] text-stone-500 font-semibold mb-1">
                <span>{product.category}</span>
                <span className="text-stone-400">SKU: {product.sku || "DHI-SKU"}</span>
              </div>
              <h1 className="font-serif text-[28px] sm:text-[38px] text-stone-900 leading-[1.15] mt-2">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                <span className="text-sm text-stone-600">{product.series}{product.designNo ? ` · Design ${product.designNo}` : ""}</span>
              </div>
            </div>

            {/* Trade price + MOQ */}
            <div className="border-y border-stone-200 py-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xl sm:text-2xl text-stone-900">
                  {hasPrice(product.wholesalePrice) ? `${priceLabel(product.wholesalePrice)} / unit` : 'Trade price on request'}
                </p>
                <p className="text-sm text-stone-600 mt-1">We reply on WhatsApp with dealer pricing and stock, usually the same day.</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs uppercase tracking-[0.12em] text-stone-500">MOQ</p>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">{product.moq || 'On request'}</p>
              </div>
            </div>

            <p className="text-[15px] text-stone-700 leading-relaxed">
              {product.description}
            </p>

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <a
                href={`https://wa.me/918459495594?text=${encodeURIComponent(`Hi! I'd like dealer pricing for ${product.title} (SKU: ${product.sku}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-stone-900 hover:bg-[#3a2f24] text-white py-4 text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors"
              >
                Get dealer price on WhatsApp
              </a>
              <button
                onClick={() => {
                  addToCart(product);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className="w-full border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer"
              >
                {addedToCart ? 'Added to your quote list' : 'Add to quote list'}
              </button>
              <div className="flex items-center gap-6 pt-1 text-sm">
                <button onClick={handleDownloadSpecSheet} className="text-stone-700 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 cursor-pointer">Download spec sheet</button>
                <button onClick={handleShare} className="text-stone-700 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 cursor-pointer">Share</button>
              </div>
            </div>

            <ul className="space-y-1.5 pt-4 text-sm text-stone-600 border-t border-stone-200">
              <li>Every design is on display at our Karol Bagh showroom</li>
              <li>Packed in corrugated cartons with bubble wrap</li>
              <li>Dispatched from New Delhi across India</li>
            </ul>
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
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
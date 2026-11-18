import { productPath } from '../utils/slug';
import React, { useState, useEffect, useRef } from 'react';
import { priceLabel, mrpLabel, hasPrice } from '../utils/price';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import QuickViewModal from '../components/QuickViewModal';
import { API_BASE_URL } from '../utils/api';

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

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const categoryParam = searchParams.get('category');
  const seriesParam = searchParams.get('series');
  const designParam = searchParams.get('design');
  const bestsellersParam = searchParams.get('bestsellers');

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All Categories');
  const [selectedSeries, setSelectedSeries] = useState(seriesParam || 'All Series');
  const [selectedDesign, setSelectedDesign] = useState(designParam || 'All Designs');
  const [showBestsellers, setShowBestsellers] = useState(bestsellersParam === 'true');
  const [loading, setLoading] = useState(true);
  const [pageImages, setPageImages] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const [designNamesList, setDesignNamesList] = useState([]);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Default category banner data (fallback if API fails)
  const defaultCategoryData = {
    "Artisan Trays & Platters": {
      image: "/images/dhi/mango-wood-trays.jpg",
      desc: "Mango wood tray sets with hand-printed designs: peacock, Kalamkari, elephant, butterfly and more. Natural grain, so no two pieces are identical."
    },
    "Trays & Serving Platters": {
      image: "/images/dhi/serving-tray-set.jpg",
      desc: "Printed decorative tray sets in our Ellite, Premium and Glass Foil series. Rectangle, square, round and oval sets with matching coasters and candy boxes."
    },
    "Organizers & Holders": {
      image: "/images/dhi/leatherette-organiser.jpg",
      desc: "Leatherette tray and organiser sets, desk and tissue organisers, napkin holders and cutlery holders for homes, offices and hotel rooms."
    },
    "Tableware & Dining": {
      image: "/images/dhi/festive-serving-set.jpg",
      desc: "Ceramic snack bowl sets with gold stands, revolving snack sets, candy sets in gift boxes and serving pieces for the festive season."
    },
    "Crockery": {
      image: "/images/dhi/ceramic-mugs.jpg",
      desc: "Ceramic crockery in our signature tray designs, plus mug sets, sippers and tumblers, so shops can sell a complete matching look."
    }
  };

  const getCategoryBannerImage = (category) => {
    // Real catalogue photos served from our own site
    const defaultImages = {
      "Artisan Trays & Platters": "/images/dhi/mango-wood-trays.jpg",
      "Trays & Serving Platters": "/images/dhi/printed-tray-set.jpg",
      "Organizers & Holders": "/images/dhi/leatherette-organiser.jpg",
      "Tableware & Dining": "/images/dhi/festive-serving-set.jpg",
      "Crockery": "/images/dhi/ceramic-mugs.jpg"
    };

    // Helper to validate URL
    const isValidUrl = (url) => {
      // Old stock-photo placeholders (Unsplash) are ignored so real photos show.
      return url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('unsplash.com');
    };

    // If image failed to load, use default
    if (failedImages[category]) {
      return defaultImages[category];
    }

    // Map categories to pageImages keys
    const keyMap = {
      "Artisan Trays & Platters": "collections_artisan",
      "Trays & Serving Platters": "collections_trays",
      "Organizers & Holders": "collections_organizers",
      "Tableware & Dining": "collections_tableware",
      "Crockery": "collections_crockery"
    };

    const key = keyMap[category];
    if (key && isValidUrl(pageImages[key])) {
      return pageImages[key];
    }

    // Fallback to default
    return defaultImages[category];
  };

  const categoryBannerData = {
    "Artisan Trays & Platters": {
      image: getCategoryBannerImage("Artisan Trays & Platters"),
      desc: "Mango wood tray sets with hand-printed designs: peacock, Kalamkari, elephant, butterfly and more. Natural grain, so no two pieces are identical."
    },
    "Trays & Serving Platters": {
      image: getCategoryBannerImage("Trays & Serving Platters"),
      desc: "Printed decorative tray sets in our Ellite, Premium and Glass Foil series. Rectangle, square, round and oval sets with matching coasters and candy boxes."
    },
    "Organizers & Holders": {
      image: getCategoryBannerImage("Organizers & Holders"),
      desc: "Leatherette tray and organiser sets, desk and tissue organisers, napkin holders and cutlery holders for homes, offices and hotel rooms."
    },
    "Tableware & Dining": {
      image: getCategoryBannerImage("Tableware & Dining"),
      desc: "Ceramic snack bowl sets with gold stands, revolving snack sets, candy sets in gift boxes and serving pieces for the festive season."
    },
    "Crockery": {
      image: getCategoryBannerImage("Crockery"),
      desc: "Ceramic crockery in our signature tray designs, plus mug sets, sippers and tumblers, so shops can sell a complete matching look."
    }
  };

  const defaultBanner = {
    image: "/images/dhi/showroom-tray-shelves.jpg",
    desc: "Every design in our current range, for shops, distributors, hotels and gifting companies. Send us the product names you want and we will reply with trade prices and stock."
  };

  const currentBanner = categoryBannerData[selectedCategory] || defaultBanner;

  useEffect(() => {
    const saved = localStorage.getItem('dhi_page_images');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const validImages = {};
        Object.keys(data).forEach(key => {
          const url = data[key];
          if (url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
            validImages[key] = url;
          }
        });

        if (Object.keys(validImages).length > 0) {
          setPageImages(validImages);
        }
      } catch (err) {
        // Silently fail
      }
    }

    fetch(`${API_BASE_URL}/api/admin/page-images`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPageImages(data);
        localStorage.setItem('dhi_page_images', JSON.stringify(data));
      })
      .catch(err => {
        // Silently fail if backend unavailable
      });

    // Fetch design names from API on component mount
    fetch(`${API_BASE_URL}/api/design-names`)
      .then(res => res.json())
      .then(data => {
        const names = data.map(d => d.name).sort();
        setDesignNamesList(['All Designs', ...names]);
      })
      .catch(err => {
        setDesignNamesList(['All Designs']);
      });
  }, []);

  useEffect(() => {
    setLoading(true);

    // Fetch design names from API
    fetch(`${API_BASE_URL}/api/design-names`)
      .then(res => res.json())
      .then(data => {
        const names = data.map(d => d.name);
        setDesignNamesList(['All Designs', ...names]);
      })
      .catch(err => {
        setDesignNamesList(['All Designs']);
      });

    if (showBestsellers) {
      fetch(`${API_BASE_URL}/api/products`)
        .then(res => res.json())
        .then(data => {
          const bestsellerProducts = data.filter(p => p.badge && p.badge.toUpperCase() === 'BESTSELLER');
          setProducts(bestsellerProducts);
          setAllProducts(bestsellerProducts);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
      return;
    }

    let url = `${API_BASE_URL}/api/products`;
    let params = [];

    if (selectedCategory && selectedCategory !== 'All Categories') {
      params.push(`category=${encodeURIComponent(selectedCategory)}`);
    }

    if (selectedCategory && selectedCategory !== 'All Categories' && selectedDesign && selectedDesign !== 'All Designs') {
      params.push(`designNo=${encodeURIComponent(selectedDesign)}`);
    }

    if (selectedSeries && selectedSeries !== 'All Series') {
      params.push(`series=${encodeURIComponent(selectedSeries)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
      })
      .catch(err => {
        // Silently fail
      });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [selectedCategory, selectedSeries, selectedDesign, showBestsellers]);

  const dynamicCategories = ["All Categories", ...new Set(allProducts.map(p => p.category).filter(Boolean))];
  const dynamicSeries = ["All Series", ...new Set(allProducts.map(p => p.series).filter(Boolean))];
  const dynamicDesigns = designNamesList.length > 0 ? designNamesList : ["All Designs"];

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All Categories') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSeriesSelect = (ser) => {
    setSelectedSeries(ser);
    const newParams = new URLSearchParams(searchParams);
    if (ser === 'All Series') {
      newParams.delete('series');
    } else {
      newParams.set('series', ser);
    }
    setSearchParams(newParams);
  };

  const handleDesignSelect = (des) => {
    setSelectedDesign(des);
    const newParams = new URLSearchParams(searchParams);
    if (des === 'All Designs') {
      newParams.delete('design');
    } else {
      newParams.set('design', des);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 overflow-hidden">
      
      {/* Header Banner with Dynamic Background Image & Breadcrumbs */}
      <FadeIn direction="down" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden shadow-xl p-8 sm:p-14 text-center bg-stone-900 text-white min-h-[300px] flex flex-col justify-center items-center">
          
          {/* Background Image with Dark Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800">
            <img
              key={currentBanner.image}
              src={currentBanner.image}
              alt={`${selectedCategory === "All Categories" ? "Divine Home India wholesale catalogue" : selectedCategory} banner`}
              className="w-full h-full object-cover opacity-70"
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={() => {
                setFailedImages({...failedImages, [selectedCategory]: true});
              }}
              onLoad={() => {
                // Image loaded successfully
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          </div>

          <div className="relative z-10 max-w-3xl">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-xs text-stone-300 mb-3 font-light">
              <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
              <span>&gt;</span>
              <Link to="/collections" className="hover:text-[#C5A059] transition-colors">Collections</Link>
              {selectedCategory !== 'All Categories' && (
                <>
                  <span>&gt;</span>
                  <span className="text-[#C5A059] font-medium">{selectedCategory}</span>
                </>
              )}
            </div>

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold block mb-2">
              {selectedSeries !== 'All Series' ? `SERIES: ${selectedSeries}` : 'WHOLESALE CATALOGUE 2026-27'}
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight">
              {selectedCategory === 'All Categories' ? 'Wholesale Catalogue 2026-27' : `Wholesale ${selectedCategory}`}
            </h1>

            <p className="text-stone-200 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto">
              {currentBanner.desc}
            </p>
          </div>

        </div>
      </FadeIn>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar: Refine Catalog */}
          <FadeIn direction="left" className="lg:col-span-1 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm h-fit space-y-8">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-4">
                <h3 className="font-serif text-base font-bold text-stone-900">Refine Catalog</h3>
                {(selectedCategory !== 'All Categories' || selectedSeries !== 'All Series' || selectedDesign !== 'All Designs') && (
                  <button
                    onClick={() => {
                      handleCategorySelect('All Categories');
                      handleSeriesSelect('All Series');
                      handleDesignSelect('All Designs');
                    }}
                    className="text-xs text-[#C5A059] underline font-medium cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Dynamic Categories Filter */}
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block mb-3">Categories</span>
              <div className="space-y-1">
                {dynamicCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex justify-between items-center cursor-pointer ${
                      selectedCategory === cat ? 'bg-stone-900 text-white font-medium' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Series / Collection Filter */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block mb-3">Catalogue Series</span>
              <div className="space-y-1">
                {dynamicSeries.map((ser, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeriesSelect(ser)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      selectedSeries === ser ? 'bg-stone-900 text-white font-medium' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {ser}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Design Name Filter */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block mb-3">Design Names</span>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {dynamicDesigns.map((des, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDesignSelect(des)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      selectedDesign === des ? 'bg-stone-900 text-white font-medium' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {des}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            <FadeIn direction="up">
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm">
                <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                  {loading ? 'Loading products...' : `Showing ${products.length} wholesale products`}
                </span>
              </div>
            </FadeIn>

            {loading ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-500 font-serif text-sm animate-pulse">Loading collection items...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-600 font-serif text-lg mb-2">No wholesale products found for this filter.</p>
                <p className="text-xs text-stone-400">Try resetting filters or check back after publishing products from the admin dashboard.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <FadeIn key={product._id} direction="zoom" delay={idx * 80}>
                    <div 
                      className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm p-4 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 h-full"
                    >
                      <div>
                        {/* Image Container with Hover Overlay */}
                        <div className="relative overflow-hidden rounded-2xl mb-4 h-60 bg-stone-100">
                          <img 
                            src={product.images && product.images[0] ? product.images[0] : '/images/dhi/mango-wood-trays.jpg'} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                            onClick={() => navigate(productPath(product))}
                          />

                          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 pointer-events-none group-hover:pointer-events-auto">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewProduct(product);
                              }}
                              className="w-full bg-white hover:bg-[#C5A059] text-stone-950 hover:text-white py-2.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>👁️</span> Quick View
                            </button>

                            <a 
                              href={`https://wa.me/918459495594?text=Hello,%20I%20am%20interested%20in%20wholesale%20pricing%20for%20${encodeURIComponent(product.title)}`}
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 text-center"
                            >
                              <span>💬</span> Quick WhatsApp
                            </a>
                          </div>

                          <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-medium pointer-events-none shadow">
                            {product.badge || product.series || 'ELLITE'}
                          </span>
                        </div>

                        <h3 
                          onClick={() => navigate(productPath(product))}
                          className="font-serif font-bold text-stone-900 text-base mt-2 mb-1 line-clamp-1 cursor-pointer hover:text-[#C5A059] transition-colors"
                        >
                          {product.title}
                        </h3>
                        <p className="text-xs text-stone-400 mb-3">SKU: {product.sku || 'DHI-SKU'} | MOQ: {product.moq || '30 pcs'}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-2">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase">Wholesale Price</span>
                          <span className="font-sans font-bold text-stone-900 text-base">{priceLabel(product.wholesalePrice)}</span>
                        </div>
                        <div className="text-right">
                          {hasPrice(product.mrp) && <span className="text-[10px] text-stone-400 block uppercase">MRP</span>}
                          <span className="text-stone-400 line-through text-xs">{mrpLabel(product.mrp)}</span>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
};

Collections.displayName = 'Collections';
export default Collections;
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems } = useContext(CartContext);

  const closeTimerRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const collectionsList = [
    // ELLITE SERIES
    {
      name: 'Elegant Vector',
      series: 'Ellite Series',
      designs: '10 Designs',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070398/divine-home/designs/elite-series-elegant%20vector.png',
    },
    {
      name: 'Lotus Glow',
      series: 'Ellite Series',
      designs: '5 Designs',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070403/divine-home/designs/elite-series-lotusglow.png',
    },
    {
      name: 'Peachy Bloom',
      series: 'Ellite Series',
      designs: '3 Designs',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070408/divine-home/designs/elite-series-peachybloom.png',
    },
    {
      name: 'Peacock Grace',
      series: 'Ellite Series',
      designs: '3 Designs',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070410/divine-home/designs/elite-series-peacockgrace.png',
    },
    {
      name: 'Ikket',
      series: 'Ellite Series',
      designs: '2 Designs',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070400/divine-home/designs/elite-series-ikket.png',
    },
    {
      name: 'Marble Fow',
      series: 'Ellite Series',
      designs: '2 Designs',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070405/divine-home/designs/elite-series-marbleflow.png',
    },
    // LEATHER CLASSIC SERIES
    {
      name: 'Leather Classic Black',
      series: 'Leather Classic',
      designs: '3 Designs',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070411/divine-home/designs/leather-classic-black.png',
    },
    {
      name: 'Leather Classic Maroon',
      series: 'Leather Classic',
      designs: '1 Design',
      image: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070413/divine-home/designs/leather-classic-marooan.png',
    },
  ];

  const seriesList = [
    "Ellite Series",
    "Leather Classic",
    "Mangowood Artistic",
    "Ceramic Storage Sets"
  ];

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const openMegaMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const closeMegaMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  const keepMegaMenuOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?category=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-[100]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between relative">

        {/* MOBILE HAMBURGER & LOGO */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
            className="lg:hidden text-stone-800 p-2 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <Link to="/" className="flex flex-col shrink-0">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.18em] text-stone-900 uppercase">
              Divine Home
            </span>
            <span className="font-serif text-base sm:text-lg font-bold tracking-[0.25em] text-stone-900 uppercase -mt-1">
              India
            </span>
            {/* Fixed Tagline Font Size (12px standard) */}
            <span className="text-xs uppercase tracking-[0.15em] text-[#C5A059] font-semibold mt-0.5">
              Artisan Trays • Ceramics • Décor
            </span>
          </Link>
        </div>

        {/* DESKTOP NAV (Optimized Spacing & Clean Hierarchy) */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs uppercase tracking-widest font-medium text-stone-700">
          <Link
            to="/"
            className={`transition-colors whitespace-nowrap ${isActive('/') && location.pathname === '/' ? 'text-[#C5A059] font-bold' : 'hover:text-[#C5A059]'}`}
          >
            Home
          </Link>

          <div
            className="relative self-stretch flex items-center"
            onMouseEnter={openMegaMenu}
            onMouseLeave={closeMegaMenu}
          >
            <Link
              to="/collections"
              onMouseEnter={openMegaMenu}
              className={`flex items-center gap-1 py-4 whitespace-nowrap transition-colors ${isActive('/collections') ? 'text-[#C5A059] font-bold' : 'hover:text-[#C5A059]'}`}
            >
              Collections
              <span className={`text-[10px] transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`}>
                ▲
              </span>
            </Link>

            {isMegaMenuOpen && (
              <div
                onMouseEnter={keepMegaMenuOpen}
                onMouseLeave={closeMegaMenu}
                className="absolute top-full left-[-150px] w-[820px] bg-white rounded-[28px] border border-stone-200 shadow-[0_18px_50px_rgba(0,0,0,0.15)] p-6 z-[200]"
              >
                <div className="grid grid-cols-4 gap-4">
                  {collectionsList.map((item, index) => (
                    <Link
                      key={index}
                      to={`/collections?series=${encodeURIComponent(item.series)}&design=${encodeURIComponent(item.name)}`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="group flex flex-col bg-white p-2.5 rounded-2xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-full h-[100px] rounded-xl overflow-hidden bg-stone-100 mb-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="font-serif text-stone-900 font-bold text-[12px] leading-tight group-hover:text-[#C5A059] transition-colors line-clamp-1 mb-0.5">
                        {item.name}
                      </h4>
                      <span className="text-[9px] text-stone-400 font-sans uppercase tracking-wide mb-1">
                        {item.series}
                      </span>
                      <span className="text-[10px] text-[#C5A059] font-sans font-semibold uppercase tracking-wide">
                        {item.designs}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between items-center gap-4">
                  <span className="text-[11px] text-stone-500 font-light whitespace-nowrap">
                    B2B Wholesale showroom located in <strong className="text-stone-900 font-medium">Karol Bagh, New Delhi</strong>
                  </span>
                  <Link
                    to="/collections"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="text-stone-900 font-semibold hover:text-[#C5A059] transition-colors uppercase tracking-wider text-[10px] flex items-center gap-1 whitespace-nowrap"
                  >
                    View All Collections →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/collections?bestsellers=true"
            className={`transition-colors whitespace-nowrap ${location.search.includes('bestsellers=true') ? 'text-[#C5A059] font-bold' : 'hover:text-[#C5A059]'}`}
          >
            Bestsellers
          </Link>

          <Link
            to="/wholesale"
            className={`transition-colors whitespace-nowrap ${isActive('/wholesale') ? 'text-[#C5A059] font-bold' : 'hover:text-[#C5A059]'}`}
          >
            Wholesale / Dealers
          </Link>

          <Link
            to="/about"
            className={`transition-colors whitespace-nowrap ${isActive('/about') ? 'text-[#C5A059] font-bold' : 'hover:text-[#C5A059]'}`}
          >
            About
          </Link>

          <Link
            to="/contact"
            className={`transition-colors whitespace-nowrap ${isActive('/contact') ? 'text-[#C5A059] font-bold' : 'hover:text-[#C5A059]'}`}
          >
            Contact
          </Link>
        </nav>

        {/* RIGHT SIDE ICONS (Balanced Spacing) */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-2">

          {/* INSTAGRAM */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-stone-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* SEARCH BUTTON - Visible on all screens */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open Search"
            className="flex items-center justify-center w-10 h-10 rounded-full text-stone-700 hover:text-[#C5A059] hover:bg-stone-100 transition-all duration-300 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* CART ICON */}
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="flex items-center justify-center w-10 h-10 rounded-full text-stone-700 hover:text-[#C5A059] hover:bg-stone-100 transition-all duration-300 relative"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/919811023456"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex items-center justify-center w-10 h-10 rounded-full text-stone-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>

          {/* WHOLESALE QUOTE (Optimized Vertical Padding) */}
          <Link
            to="/wholesale"
            className="bg-stone-900 hover:bg-[#C5A059] text-white text-[10px] sm:text-xs uppercase tracking-wider font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors shadow-md hidden sm:inline-block whitespace-nowrap"
          >
            Wholesale Quote
          </Link>

        </div>

      </div>

      {/* SEARCH & CATEGORY POPUP MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[400] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative p-6 sm:p-8">
            
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-colors cursor-pointer text-xs font-bold"
            >
              ✕
            </button>

            <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Search Wholesale Catalog</h3>

            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="Search ceramics, trays, vases, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-16 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
              />
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-2.5 text-[10px] bg-stone-200 hover:bg-stone-300 text-stone-700 px-2.5 py-1.5 rounded-md font-semibold cursor-pointer transition-colors"
              >
                ESC
              </button>
            </form>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold block mb-2">
                  Popular Wholesale Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {collectionsList.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(`/collections?design=${encodeURIComponent(cat.name)}`);
                        setIsSearchOpen(false);
                      }}
                      className="bg-stone-100 hover:bg-[#C5A059] hover:text-white text-stone-700 text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer font-medium flex items-center gap-1.5"
                    >
                      <span>🏷️</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold block mb-2">
                  Browse by Series
                </span>
                <div className="flex flex-wrap gap-2">
                  {seriesList.map((ser, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(`/collections?series=${encodeURIComponent(ser)}&category=All%20Categories&design=All%20Designs`);
                        setIsSearchOpen(false);
                      }}
                      className="bg-amber-50 hover:bg-[#C5A059] hover:text-white text-amber-900 text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer font-medium flex items-center gap-1.5"
                    >
                      <span>✨</span> {ser}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[300] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-80 max-w-[85vw] bg-[#FDFBF7] h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center pb-6 border-b border-stone-200">
              <div>
                <span className="font-serif text-lg font-bold tracking-[0.15em] text-stone-900 uppercase block">Divine Home</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">B2B Trade Showroom</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-800 transition-colors cursor-pointer">✕</button>
            </div>
            <div className="flex flex-col space-y-3 pt-6 text-xs uppercase tracking-widest font-semibold text-stone-800">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl transition-colors flex items-center justify-between hover:bg-stone-100"><span>Home</span><span>&rarr;</span></Link>
              <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl transition-colors flex items-center justify-between hover:bg-stone-100"><span>Collections</span><span>&rarr;</span></Link>
              <Link to="/wholesale" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl transition-colors flex items-center justify-between hover:bg-stone-100"><span>Wholesale / Dealers</span><span>&rarr;</span></Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl transition-colors flex items-center justify-between hover:bg-stone-100"><span>About</span><span>&rarr;</span></Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl transition-colors flex items-center justify-between hover:bg-stone-100"><span>Contact</span><span>&rarr;</span></Link>
            </div>
            <div className="mt-auto pt-6 border-t border-stone-200 text-stone-500 text-[11px] space-y-2">
              <p className="font-medium text-stone-900">Karol Bagh Trade Desk, New Delhi</p>
              <p>Mon - Sat: 10:30 AM - 8:00 PM</p>
              <a href="https://wa.me/919811023456" target="_blank" rel="noreferrer" className="block mt-3 bg-emerald-600 text-white text-center py-3 rounded-xl font-medium uppercase tracking-wider text-xs shadow-sm">💬 WhatsApp Trade Support</a>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

Navbar.displayName = 'Navbar';
export default Navbar;
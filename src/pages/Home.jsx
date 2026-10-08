import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import InstagramReelsCarousel from '../components/InstagramReelsCarousel';
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

const Home = () => {
  const [products, setProducts] = useState([]);
  const [reels, setReels] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [pageImages, setPageImages] = useState({
    home_story: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070410/divine-home/designs/elite-series-peacockgrace.png"
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [rfqForm, setRfqForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    quantity: '',
    city: '',
    instructions: ''
  });
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [submittingRfq, setSubmittingRfq] = useState(false);

  const defaultHeroImages = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920"
  ];

  const heroImages = heroBanners.length > 0
    ? heroBanners.map(b => b.image)
    : defaultHeroImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [heroBanners]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/hero-banners/active`)
      .then(res => res.json())
      .then(data => setHeroBanners(data))
      .catch(err => setToast({ message: 'Failed to load banners', type: 'error' }));

    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => setToast({ message: 'Failed to load products', type: 'error' }));

    fetch(`${API_BASE_URL}/api/reels`)
      .then(res => res.json())
      .then(data => setReels(data))
      .catch(err => setToast({ message: 'Failed to load reels', type: 'error' }));

    const saved = localStorage.getItem('dhi_page_images');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPageImages(prev => ({...prev, ...data}));
      } catch (err) {
        // Silently fail if localStorage parsing fails
      }
    }
  }, []);

  const handleRfqChange = (e) => {
    setRfqForm({ ...rfqForm, [e.target.name]: e.target.value });
  };

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    setSubmittingRfq(true);

    const leadPayload = {
      name: rfqForm.name,
      company: rfqForm.company || 'Home Page RFQ Lead',
      phone: rfqForm.phone,
      email: rfqForm.email || 'N/A',
      quantity: rfqForm.quantity,
      city: rfqForm.city,
      instructions: rfqForm.instructions || 'Submitted via Home Page Hero RFQ Modal'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      const data = await response.json();

      if (response.ok) {
        setRfqSubmitted(true);
      } else {
        alert("Error submitting RFQ: " + (data.error || "Please try again"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Failed to connect to server. Make sure your backend server is running.");
    } finally {
      setSubmittingRfq(false);
    }
  };

  const categories = [
    { name: "Elegant Vector", designs: "10 Designs", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070398/divine-home/designs/elite-series-elegant%20vector.png" },
    { name: "Lotus Glow", designs: "5 Designs", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070403/divine-home/designs/elite-series-lotusglow.png" },
    { name: "Peachy Bloom", designs: "3 Designs", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070408/divine-home/designs/elite-series-peachybloom.png" },
    { name: "Peacock Grace", designs: "3 Designs", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070410/divine-home/designs/elite-series-peacockgrace.png" },
    { name: "Ikket", designs: "2 Designs", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070400/divine-home/designs/elite-series-ikket.png" },
    { name: "Marble Fow", designs: "2 Designs", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070405/divine-home/designs/elite-series-marbleflow.png" },
    { name: "Leather Classic Black", designs: "3 Designs", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070411/divine-home/designs/leather-classic-black.png" },
    { name: "Leather Classic Maroon", designs: "1 Design", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070413/divine-home/designs/leather-classic-marooan.png" }
  ];

  const wholesaleLines = [
    { name: "Elegant Vector", designs: "10 DESIGNS", desc: "Premium geometric and vector-inspired patterns with contemporary finishes...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070398/divine-home/designs/elite-series-elegant%20vector.png", series: "Elite Series" },
    { name: "Lotus Glow", designs: "5 DESIGNS", desc: "Ethereal lotus-inspired designs with luminous glazes and hand-painted details...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070403/divine-home/designs/elite-series-lotusglow.png", series: "Elite Series" },
    { name: "Peachy Bloom", designs: "3 DESIGNS", desc: "Warm peachy tones with floral accents, perfect for contemporary luxury interiors...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070408/divine-home/designs/elite-series-peachybloom.png", series: "Elite Series" },
    { name: "Peacock Grace", designs: "3 DESIGNS", desc: "Ornate peacock motifs with rich jewel tones and metallic embellishments...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070410/divine-home/designs/elite-series-peacockgrace.png", series: "Elite Series" },
    { name: "Ikket", designs: "2 DESIGNS", desc: "Traditional artisanal patterns with contemporary execution and premium finishes...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070400/divine-home/designs/elite-series-ikket.png", series: "Elite Series" },
    { name: "Marble Fow", designs: "2 DESIGNS", desc: "Sophisticated marble-inspired textures with elegant surface detailing...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070405/divine-home/designs/elite-series-marbleflow.png", series: "Elite Series" },
    { name: "Leather Classic Black", designs: "3 DESIGNS", desc: "Timeless classic leather finishes in rich black with premium hand-finishing...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070411/divine-home/designs/leather-classic-black.png", series: "Leather Classic" },
    { name: "Leather Classic Maroon", designs: "1 DESIGN", desc: "Sophisticated maroon leather with luxurious surface treatment and durability...", image: "https://res.cloudinary.com/cm8nznam/image/upload/v1790070413/divine-home/designs/leather-classic-marooan.png", series: "Leather Classic" }
  ];

  const faqs = [
    { q: "What is the Minimum Order Quantity (MOQ)?", a: "Our wholesale MOQ starts from 30–50 pieces per SKU for artisan trays and ceramic tableware, and 20 pieces for statement decor pieces." },
    { q: "Can I visit the showroom in Karol Bagh?", a: "Yes! Dealers, architects, and retail buyers are welcome to visit our Karol Bagh, New Delhi trade showroom." },
    { q: "What is your transit breakage policy?", a: "We pack using 5-ply export corrugation, individual bubble armor, and offer instant replacement against unboxing photographs." },
    { q: "Do you offer custom corporate gifting branding?", a: "Yes! For bulk corporate gifting and festive hampers, we provide custom satin-lined keepsake packaging." }
  ];

  // Dynamic filtering based on admin badge tags
  const bestsellers = products.filter(p => p.badge && p.badge.toUpperCase() === 'BESTSELLER');
  const newArrivals = products.filter(p => p.badge && p.badge.toUpperCase() === 'NEW');

  // Only show products with correct badges - no fallback
  const displayBestsellers = bestsellers;
  const displayNewArrivals = newArrivals;

  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-hidden">
      
      {/* 1. Hero Section (Only Images Slider without Headings & Buttons, Fixed Overlapping) */}
      <section className="relative h-[75vh] sm:h-[85vh] flex items-center justify-center bg-stone-950 text-white overflow-hidden">
        {heroImages.map((img, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img src={img} alt="Hero Slide" className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Non-overlapping Slide Buttons */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
          className="absolute left-6 sm:left-10 z-30 w-12 h-12 rounded-full bg-black/50 hover:bg-[#C5A059] text-white flex items-center justify-center border border-white/30 transition-all cursor-pointer backdrop-blur-md shadow-2xl"
          aria-label="Previous Slide"
        >
          &larr;
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-6 sm:right-10 z-30 w-12 h-12 rounded-full bg-black/50 hover:bg-[#C5A059] text-white flex items-center justify-center border border-white/30 transition-all cursor-pointer backdrop-blur-md shadow-2xl"
          aria-label="Next Slide"
        >
          &rarr;
        </button>
      </section>

      {/* 2. Stats Bar Section */}
      <FadeIn direction="zoom" delay={150}>
        <section className="bg-white border-b border-stone-200 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">500+</p>
              <p className="text-xs uppercase tracking-wider text-stone-500 mt-1 font-semibold">Curated Décor SKUs</p>
            </div>
            <div>
              <p className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">280+</p>
              <p className="text-xs uppercase tracking-wider text-stone-500 mt-1 font-semibold">Retail & Trade Dealers</p>
            </div>
            <div>
              <p className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Karol Bagh</p>
              <p className="text-xs uppercase tracking-wider text-stone-500 mt-1 font-semibold">Delhi Showroom Hub</p>
            </div>
            <div>
              <p className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">100%</p>
              <p className="text-xs uppercase tracking-wider text-stone-500 mt-1 font-semibold">Insured Transit Safety</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 3. Explore By Category Section */}
      <section className="py-12 sm:py-16 bg-[#FDFBF7] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-2">
              Explore by Series & Design
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mb-2">
              Shop Handcrafted Home Décor & Trays
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto mb-6 font-light">
              Direct wholesale collections from Karol Bagh, New Delhi — artisan trays, ceramics, and statement interior accents.
            </p>
            <Link to="/collections" className="inline-block text-xs font-bold text-stone-900 hover:text-[#C5A059] tracking-wider uppercase mb-8 sm:mb-12 underline underline-offset-4 transition-colors">
              View Full Catalog &rarr;
            </Link>
          </FadeIn>

          <FadeIn direction="up" delay={200}>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 items-start">
              {categories.map((cat, index) => (
                <Link to={`/collections?category=${encodeURIComponent(cat.name)}`} key={index} className="group flex flex-col items-center cursor-pointer">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-white border border-stone-200 shadow-sm group-hover:border-[#C5A059] transition-all duration-300 mb-2.5 sm:mb-3">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-serif text-stone-900 font-medium text-xs group-hover:text-[#C5A059] transition-colors leading-tight mb-1 text-center line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-sans">{cat.designs}</span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. New Wholesale Arrivals Section */}
      <FadeIn direction="right">
        <section className="py-20 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white border-y border-stone-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-stone-800">
              <div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
                  New Wholesale Arrivals
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-2 font-light max-w-xl">
                  Be the first retail partner to stock our latest artisan-crafted brass vanity sets, fluted ceramic urns, and reactive glaze collections.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link 
                  to="/collections" 
                  className="text-xs font-bold text-stone-950 bg-[#C5A059] hover:bg-white px-6 py-3 rounded-xl transition-all shadow-lg uppercase tracking-wider flex items-center gap-2 group"
                >
                  <span>View Full Catalog</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => document.getElementById('arrivals-slider').scrollBy({ left: -340, behavior: 'smooth' })}
                    className="w-11 h-11 rounded-full border border-stone-700 bg-stone-900 hover:bg-[#C5A059] hover:text-stone-950 hover:border-[#C5A059] flex items-center justify-center text-stone-300 transition-all shadow-md cursor-pointer"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={() => document.getElementById('arrivals-slider').scrollBy({ left: 340, behavior: 'smooth' })}
                    className="w-11 h-11 rounded-full border border-stone-700 bg-stone-900 hover:bg-[#C5A059] hover:text-stone-950 hover:border-[#C5A059] flex items-center justify-center text-stone-300 transition-all shadow-md cursor-pointer"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Slider Grid */}
            <div
              id="arrivals-slider"
              className="flex gap-6 overflow-x-auto pb-8 pt-3 px-2 scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayNewArrivals.length > 0 ? (
                displayNewArrivals.map(product => (
                  <div key={product._id} className="w-[300px] sm:w-[320px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12 text-stone-400">
                  <p className="text-sm font-serif">No new arrivals available yet.</p>
                </div>
              )}
            </div>

          </div>
        </section>
      </FadeIn>

      {/* 5. Explore Our Wholesale Lines Section */}
      <section className="py-20 bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14 relative z-10">
          <FadeIn direction="down">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Explore Our Wholesale Lines
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto font-light mb-6">
              From handcrafted brass vanity trays to vitrified stoneware ceramics, browse our signature trade collections.
            </p>
            <Link to="/collections" className="bg-[#C5A059] text-stone-950 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-lg inline-flex items-center gap-1">
              Explore All Collections &rarr;
            </Link>
          </FadeIn>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {wholesaleLines.map((line, idx) => (
              <FadeIn key={idx} direction="zoom" delay={idx * 100}>
                <Link 
                  to={`/collections?series=${encodeURIComponent(line.series)}&design=${encodeURIComponent(line.name)}`}
                  className="group relative h-[420px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-end p-6 text-white border border-stone-800 transition-all duration-500 hover:-translate-y-2 hover:border-[#C5A059]/50 block"
                >
                  <div className="absolute inset-0 bg-stone-950">
                    <img src={line.image} alt={line.name} className="w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent"></div>
                  </div>

                  <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
                    <span className="bg-[#C5A059] text-stone-950 text-[10px] uppercase px-3 py-1 rounded-full font-extrabold tracking-widest shadow-md">
                      {line.designs}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-stone-950 transition-colors shadow-lg">
                      &rarr;
                    </span>
                  </div>

                  <div className="relative z-10 text-left">
                    <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-[#C5A059] transition-colors leading-tight">
                      {line.name}
                    </h3>
                    <p className="text-xs text-stone-300 font-light line-clamp-2 leading-relaxed">
                      {line.desc}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Wholesale Bestsellers Section */}
      <FadeIn direction="left">
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FDFBF7] to-stone-100/60 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Top Re-Ordered Collections
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                  Our Wholesale Bestsellers
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
                  Top re-ordered brass vanity platters, dinner sets, and tactile barista mugs by dealers across India.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/collections" className="text-xs font-bold text-stone-900 bg-white border border-stone-300 px-4 py-2.5 rounded-xl hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-white transition-all shadow-sm uppercase tracking-wider">
                  View All &rarr;
                </Link>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => document.getElementById('bestsellers-slider').scrollBy({ left: -320, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-colors shadow-md cursor-pointer"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={() => document.getElementById('bestsellers-slider').scrollBy({ left: 320, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-colors shadow-md cursor-pointer"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div id="bestsellers-slider" className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {displayBestsellers.length > 0 ? (
                displayBestsellers.map(product => (
                  <div key={product._id} className="w-[300px] sm:w-[320px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12 text-stone-400">
                  <p className="text-sm font-serif">No bestsellers available yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 7. Instagram Reels Section */}
      <FadeIn direction="up">
        <section className="py-16 sm:py-20 bg-[#FDFBF7] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                Social Media Showcase
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mb-3">
                Watch Our Instagram Reels
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto font-light">
                Behind-the-scenes looks at our artisan collections, product styling, and wholesale stories.
              </p>
            </div>

            {reels && reels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {reels.map((reel) => (
                  <div key={reel._id} className="flex justify-center">
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative w-full max-w-[260px] h-[380px] rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-2 block bg-stone-900 border border-stone-200"
                    >
                      {reel.image ? (
                        <img
                          src={reel.image}
                          alt={reel.title}
                          className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                          <span className="text-4xl">📱</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                        <h3 className="font-serif text-sm font-bold text-white line-clamp-2 group-hover:text-[#C5A059] transition-colors leading-snug">
                          {reel.title}
                        </h3>
                      </div>

                      <div className="absolute top-4 right-4 z-10">
                        <span className="w-10 h-10 rounded-full bg-[#E1306C] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <p className="text-stone-500 font-serif">No Instagram Reels available yet.</p>
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      {/* 8. Why Dealers & Retailers Partner With Us */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">Trade Partnerships</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">Why Dealers & Retailers Partner With Us</h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 font-light">A wholesale supply system built around margin protection, fast inventory replenishment, and zero-breakage guarantee.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Artisan Handcrafted Quality", desc: "Every tray, bowl, and vase features authentic artisanal finishing—from polished brass borders to natural reactive glazes." },
            { num: "02", title: "Direct Distributor Margins", desc: "Transparent wholesale pricing tiers engineered to ensure healthy retail margins for our dealers and corporate gift houses." },
            { num: "03", title: "Festive & Bulk Gifting", desc: "Custom gift packaging, satin lining, and coordinated combos ready for corporate gifting and festive hampers." },
            { num: "04", title: "Zero-Breakage Guarantee", desc: "Palletized shipments with multi-layer bubble and corrugated armor ensure delicate trays and ceramics arrive pristine." }
          ].map((item, idx) => (
            <FadeIn key={idx} direction="up" delay={idx * 150}>
              <div className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-md hover:shadow-xl hover:border-[#C5A059]/40 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <span className="font-serif text-3xl font-extrabold text-[#C5A059] block mb-3">{item.num}</span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 9. Wholesale & Dealer FAQs */}
      <section className="py-16 sm:py-20 bg-stone-100/70 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="down">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">Frequently Asked Questions</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">Wholesale & Dealer FAQs</h2>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FadeIn key={idx} direction="up" delay={idx * 100}>
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:border-[#C5A059]/50 transition-all">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left flex justify-between items-center font-serif text-base sm:text-lg font-bold text-stone-900 cursor-pointer gap-4"
                  >
                    <span>{faq.q}</span>
                    <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[#C5A059] text-xl shrink-0 font-sans">{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs sm:text-sm text-stone-600 mt-4 pt-4 border-t border-stone-100 leading-relaxed font-light">
                      {faq.a}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 10. About Brand Story */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative flex justify-center">
              <div className="w-full sm:w-[460px] h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl relative border-2 border-stone-200">
                <img src={pageImages.home_story} alt="Divine Home India Showroom" className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-stone-200 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                  <div>
                    <p className="font-serif text-xs font-bold text-stone-900">Karol Bagh, New Delhi</p>
                    <p className="text-[10px] text-stone-500 uppercase">Direct Wholesale Showroom</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="space-y-6 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold block">About Divine Home India</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">Luxury Handcrafted Home Décor For Trade Dealers & Distributors</h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">Based in Karol Bagh, New Delhi, Divine Home India is a leading B2B wholesale distribution house specializing in luxury handcrafted home décor, artisan trays, premium ceramics, and bespoke interior statements.</p>
              <div className="flex justify-center lg:justify-start gap-4 pt-2">
                <Link to="/about" className="bg-stone-900 hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full transition-colors inline-block shadow-md">Read Full Story &rarr;</Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Wholesale Bulk Enquiry Popup Modal */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => { setIsRfqModalOpen(false); setRfqSubmitted(false); }}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-stone-200/60 hover:bg-stone-300 flex items-center justify-center text-stone-800 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6 pr-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-1">
                B2B Wholesale Trade Desk
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Wholesale Bulk Enquiry
              </h3>
            </div>

            {rfqSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 sm:p-8 rounded-2xl text-center space-y-3">
                <h4 className="font-serif text-lg sm:text-xl font-bold">RFQ Request Submitted!</h4>
                <p className="text-xs">Thank you, {rfqForm.name}. Our Karol Bagh trade desk will review your bulk enquiry and connect with your wholesale price sheet within 2 hours.</p>
                <button 
                  onClick={() => { setIsRfqModalOpen(false); setRfqSubmitted(false); }}
                  className="mt-4 bg-stone-900 text-white text-xs uppercase px-6 py-2.5 rounded-xl font-semibold tracking-wider hover:bg-[#C5A059] cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={rfqForm.name}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Company / Cafe / Retail Name</label>
                    <input 
                      type="text" 
                      name="company"
                      placeholder="e.g. Roastery Cafe & Kitchen"
                      value={rfqForm.company}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={rfqForm.phone}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Business Email</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="procurement@brand.com"
                      value={rfqForm.email}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Estimated Quantity Required *</label>
                    <input 
                      type="text" 
                      name="quantity"
                      required
                      placeholder="e.g. 100 sets / 250 pcs"
                      value={rfqForm.quantity}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Delivery City / Pincode *</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      placeholder="e.g. Mumbai, 400001"
                      value={rfqForm.city}
                      onChange={handleRfqChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">Customization or Special Instructions</label>
                  <textarea 
                    name="instructions"
                    rows="2"
                    placeholder="Need custom logo debossing / specific color glaze / packaging details..."
                    value={rfqForm.instructions}
                    onChange={handleRfqChange}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#C5A059]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a 
                    href={`https://wa.me/919811023456?text=Hello,%20I%20want%20to%20enquire%20about%20bulk%20wholesale%20order%20for%20${rfqForm.quantity || 'bulk items'}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#00A859] hover:bg-[#008f4c] text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                  >
                    <span>💬</span> Instant WhatsApp Quote
                  </a>
                  <button 
                    type="submit"
                    disabled={submittingRfq}
                    className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <span>✈</span> {submittingRfq ? 'SUBMITTING...' : 'Submit RFQ Request'}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-stone-500 font-medium">
                    🛡️ GST Invoicing & Pan-India Insured Transport Supported
                  </span>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

Home.displayName = 'Home';
export default Home;
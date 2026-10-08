import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../utils/api';

const InstagramReelsCarousel = () => {
  const [reelsList, setReelsList] = useState([]);
  const scrollRef = useRef(null);
  const videoRefs = useRef({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reels`)
      .then(res => res.json())
      .then(data => {
        setReelsList(data);
      })
      .catch(err => {
        // Silently fail if reels unavailable
      });
  }, []);

  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.play().catch(error => {
          video.muted = true;
          video.play().catch(e => {
            // Autoplay failed, video will show poster image
          });
        });
      }
    });
  }, [reelsList]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? 320 : 260;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (reelsList.length === 0) return null;

  return (
    <section className="py-16 bg-[#FDFBF7] border-t border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold block mb-2">
              INSTAGRAM SHOWCASE • @DIVINEHOMEINDIA
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Craftsmanship in Motion
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full border border-stone-300 bg-white hover:bg-stone-900 hover:text-white hover:border-stone-900 flex items-center justify-center text-stone-800 transition-colors cursor-pointer shadow-sm"
            >
              &larr;
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full border border-stone-300 bg-white hover:bg-stone-900 hover:text-white hover:border-stone-900 flex items-center justify-center text-stone-800 transition-colors cursor-pointer shadow-sm"
            >
              &rarr;
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reelsList.map((reel) => (
            <a 
              key={reel._id}
              href={reel.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex-shrink-0 w-[260px] sm:w-[290px] h-[440px] sm:h-[480px] rounded-3xl overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 snap-start border border-stone-200/60 block cursor-pointer"
            >
              {/* Fallback Image Poster (ताकि अगर वीडियो लोड न हो या ब्लॉक हो, तो भी फोटो दिखे) */}
              <img 
                src={reel.image} 
                alt={reel.title} 
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Video Element on top */}
              <video 
                ref={el => videoRefs.current[reel._id] = el}
                src={reel.videoUrl}
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-1 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  // अगर वीडियो लिंक फेल हो जाए, तो वीडियो एलिमेंट छुप जाएगा और पीछे की तस्वीर दिखने लगेगी
                  e.target.style.display = 'none';
                }}
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-10 pointer-events-none"></div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
                <span className="bg-white/25 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Reel
                </span>
                <span className="text-white text-[11px] font-sans font-medium bg-black/40 px-2.5 py-1 rounded-full">
                  {reel.views}
                </span>
              </div>

              {/* Bottom Details & CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end pointer-events-none">
                <h3 className="font-serif text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 mb-3 group-hover:text-[#C5A059] transition-colors">
                  {reel.title}
                </h3>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/90 pt-3 border-t border-white/20">
                  <span>Watch on Instagram</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InstagramReelsCarousel;
import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing B2B Assets...');

  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    if (!isReload && sessionStorage.getItem('dhi_visited')) {
      setLoading(false);
      return;
    }

    sessionStorage.setItem('dhi_visited', 'true');

    // कुल समय सिर्फ 1 सेकंड (बहुत तेज और स्मूथ)
    const totalDuration = 1000; 
    let currentProgress = 0;

    const timerInterval = setInterval(() => {
      currentProgress += 5; // तेजी से प्रोग्रेस बढ़ाने के लिए स्टेप 5 रखा है
      if (currentProgress <= 100) {
        setProgress(currentProgress);

        if (currentProgress < 50) {
          setStatusText('Initializing B2B Assets...');
        } else if (currentProgress < 60) {
          setStatusText('Preparing Wholesale Catalog...');
        } else if (currentProgress < 90) {
          setStatusText('Connecting Karol Bagh Trade Desk...');
        } else {
          setStatusText('Opening Showroom & Collections...');
        }
      }
    }, totalDuration / 20);

    const finishTimer = setTimeout(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 500); // कर्टेन खुलने का फास्ट ट्रांजिशन टाइम
    }, totalDuration);

    return () => {
      clearInterval(timerInterval);
      clearTimeout(finishTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* ================= LEFT CURTAIN ================= */}
      <div className={`absolute top-0 left-0 w-1/2 h-full bg-[#1c1917] z-25 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] border-r border-[#C5A059]/30 ${animateOut ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

      {/* ================= RIGHT CURTAIN ================= */}
      <div className={`absolute top-0 right-0 w-1/2 h-full bg-[#1c1917] z-25 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] border-l border-[#C5A059]/30 ${animateOut ? 'translate-x-full' : 'translate-x-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent"></div>
      </div>

      {/* ================= CENTER BRAND REVEAL CONTENT ================= */}
      <div className={`relative z-30 flex flex-col items-center text-center px-4 transition-all duration-500 ${animateOut ? 'scale-110 opacity-0 filter blur-sm' : 'scale-100 opacity-100'}`}>
        
        <div className={`w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C5A059]/40 flex items-center justify-center mb-6 shadow-2xl transition-all duration-500 ${animateOut ? '-translate-y-20 opacity-0 scale-75' : 'translate-y-0 opacity-100'}`}>
          <span className="font-serif text-2xl font-bold text-[#C5A059]">D</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.2em] text-white uppercase">
          <span className={`transition-all duration-500 ${animateOut ? '-translate-x-24 opacity-0' : 'translate-x-0 opacity-100'}`}>DIVINE</span>
          <span className={`transition-all duration-500 text-[#C5A059] ${animateOut ? 'translate-y-16 opacity-0' : 'translate-y-0 opacity-100'}`}>HOME</span>
          <span className={`transition-all duration-500 ${animateOut ? 'translate-x-24 opacity-0' : 'translate-x-0 opacity-100'}`}>INDIA</span>
        </div>

        <div className={`mt-3 text-[10px] sm:text-xs uppercase tracking-[0.35em] text-stone-400 font-medium transition-all duration-300 ${animateOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          KAROL BAGH, NEW DELHI • B2B TRADE SHOWROOM
        </div>

      </div>

      {/* ================= BOTTOM INFO ================= */}
      <div className={`absolute bottom-6 left-6 right-6 z-30 flex justify-between items-end text-xs uppercase tracking-widest text-[#C5A059] font-serif transition-opacity duration-300 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] sm:text-xs shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C5A059] animate-ping mr-2"></span>
          {statusText}
        </div>
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 font-bold text-sm sm:text-base shadow-lg">
          {progress}%
        </div>
      </div>

    </div>
  );
};

Preloader.displayName = 'Preloader';
export default Preloader;
import React, { useEffect, useRef, useState } from 'react';
import { img as imgUrl, srcSet, onImgError } from '../utils/img';

// Swipeable square product carousel (scroll-snap) with thumbnails, arrows, dots and desktop hover zoom.
const ProductGallery = ({ images = [], title = '' }) => {
  const list = images.filter(Boolean);
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null); // {x,y} in % while hovering on desktop

  useEffect(() => { setActive(0); if (track.current) track.current.scrollLeft = 0; }, [list.join('|')]);

  const go = (i) => {
    const n = (i + list.length) % list.length;
    const el = track.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
    setActive(n);
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };

  const onMove = (e) => {
    if (window.matchMedia('(hover: none)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  if (!list.length) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      {list.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[560px] no-scrollbar">
          {list.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`w-16 h-16 md:w-20 md:h-20 shrink-0 overflow-hidden rounded-sm bg-[#F3EEE6] transition-opacity ${active === i ? 'ring-1 ring-stone-900 opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <img src={imgUrl(img, 240)} onError={onImgError(img)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 min-w-0">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar aspect-square bg-[#F3EEE6] rounded-md"
        >
          {list.map((img, i) => (
            <div
              key={img + i}
              className="relative w-full h-full shrink-0 snap-center overflow-hidden md:cursor-zoom-in"
              onMouseMove={i === active ? onMove : undefined}
              onMouseLeave={() => setZoom(null)}
            >
              <img
                src={imgUrl(img, 960)}
                srcSet={srcSet(img, [480, 960, 1600])}
                sizes="(min-width: 768px) 50vw, 100vw"
                onError={onImgError(img)}
                alt={i === 0 ? title : `${title} – photo ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                style={zoom && i === active ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </div>
          ))}
        </div>

        {list.length > 1 && (
          <>
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous photo"
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-sm">‹</button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next photo"
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-sm">›</button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
              {list.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${active === i ? 'w-5 bg-stone-900' : 'w-1.5 bg-stone-900/30'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;

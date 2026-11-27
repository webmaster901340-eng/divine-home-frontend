import React from 'react';
import { Link } from 'react-router-dom';
import { POSTS, postPath } from '../blog/posts';
import { img, srcSet, onImgError } from '../utils/img';

const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const Blog = () => {
  const [lead, ...rest] = POSTS;
  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-10">
        <h1 className="font-serif text-[34px] sm:text-5xl leading-[1.1] text-stone-900 max-w-3xl">
          Guides for tray buyers, retailers and gifting teams
        </h1>
        <p className="text-[15px] sm:text-base text-stone-600 leading-relaxed mt-4 max-w-2xl">
          How to choose a tray supplier, what sells in shops, sizes, materials and festive buying, from our team in Karol Bagh, New Delhi.
        </p>
      </section>

      {/* Lead article */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <Link to={postPath(lead)} className="group grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-[#E9E2D6]">
            <img src={img(lead.cover, 1600)} srcSet={srcSet(lead.cover, [960, 1600])} sizes="(min-width: 1024px) 58vw, 100vw"
              onError={onImgError(lead.cover)} alt={lead.coverAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a5c25] font-semibold">{lead.category} · {fmt(lead.date)}</p>
            <h2 className="font-serif text-[26px] sm:text-[34px] leading-[1.15] text-stone-900 mt-3 group-hover:underline underline-offset-4 decoration-1">{lead.title}</h2>
            <p className="text-[15px] text-stone-600 leading-relaxed mt-3">{lead.excerpt}</p>
            <span className="inline-block mt-5 text-sm font-semibold text-stone-900 border-b border-stone-900 pb-0.5">Read the guide</span>
          </div>
        </Link>
      </section>

      {/* All other articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 border-t border-stone-300">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pt-12">
          {rest.map((p) => (
            <Link key={p.slug} to={postPath(p)} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-[#E9E2D6]">
                <img src={img(p.cover, 960)} srcSet={srcSet(p.cover, [480, 960])} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  onError={onImgError(p.cover)} loading="lazy" alt={p.coverAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#7a5c25] font-semibold mt-4">{p.category}</p>
              <h2 className="font-serif text-xl sm:text-[22px] leading-snug text-stone-900 mt-2 group-hover:underline underline-offset-4 decoration-1">{p.title}</h2>
              <p className="text-sm text-stone-600 leading-relaxed mt-2">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Unknown URLs: the SPA host still answers 200, so tell search engines not to index this view (avoids soft-404s).
const NotFound = () => {
  useEffect(() => {
    document.title = 'Page not found | Divine Home India';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, follow';
    meta.id = 'robots-noindex';
    document.head.appendChild(meta);
    return () => document.getElementById('robots-noindex')?.remove();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-3xl sm:text-4xl text-stone-900">This page doesn't exist</h1>
      <p className="text-stone-600 mt-4">It may have moved. Try the catalogue or our buying guides.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/collections" className="px-7 py-4 bg-stone-900 text-white text-xs font-semibold uppercase tracking-[0.14em]">See the catalogue</Link>
        <Link to="/blog" className="px-7 py-4 border border-stone-900 text-stone-900 text-xs font-semibold uppercase tracking-[0.14em]">Buying guides</Link>
      </div>
    </div>
  );
};

export default NotFound;

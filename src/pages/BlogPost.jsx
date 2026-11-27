import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { POSTS, getPost, postPath } from '../blog/posts';
import { SITE, blogPostSchema } from '../seo/pages';
import { applyHead, setJsonLd } from '../components/Seo';
import { img, srcSet, onImgError } from '../utils/img';
import NotFound from './NotFound';

const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPost(slug);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!post) return undefined;
    const path = postPath(post);
    applyHead({ path, title: post.metaTitle || post.title, description: post.description, image: `${SITE}${post.cover}` });
    setJsonLd('blog-ld', blogPostSchema(post, path));
    return () => setJsonLd('blog-ld', null);
  }, [post]);

  if (!post) {
    return <NotFound />;
  }
  // Internal links inside the article body are plain <a> tags; route them without a full page reload.
  const onBodyClick = (e) => {
    const a = e.target.closest('a');
    const href = a?.getAttribute('href');
    if (href && href.startsWith('/') && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      navigate(href);
    }
  };

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="bg-[#FBF9F5] min-h-screen">
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14">
        <nav className="text-xs text-stone-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900">Home</Link> / <Link to="/blog" className="hover:text-stone-900">Blog</Link> / <span className="text-stone-700">{post.category}</span>
        </nav>
        <h1 className="font-serif text-[30px] sm:text-[44px] leading-[1.12] text-stone-900 mt-5">{post.title}</h1>
        <p className="text-sm text-stone-500 mt-4">By the Divine Home India team · <time dateTime={post.date}>{fmt(post.date)}</time></p>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="aspect-[16/9] overflow-hidden bg-[#E9E2D6]">
          <img src={img(post.cover, 960)} srcSet={srcSet(post.cover, [480, 960, 1600])} sizes="(min-width: 1024px) 1024px, 100vw"
            onError={onImgError(post.cover)} alt={post.coverAlt} fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* eslint-disable-next-line react/no-danger -- body is our own trusted article HTML from src/blog/posts.js */}
      <div className="blog-prose max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14" onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: post.body }} />

      {post.faq?.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-14">
          <h2 className="font-serif text-2xl sm:text-[32px] text-stone-900 mb-6">Frequently asked questions</h2>
          <div className="border-t border-stone-300">
            {post.faq.map(([q, a], i) => (
              <div key={q} className="border-b border-stone-300">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}
                  className="w-full text-left flex justify-between items-center gap-6 py-5 text-base sm:text-lg font-medium text-stone-900">
                  <span>{q}</span>
                  <span className="text-2xl leading-none text-stone-500 shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                <p className={`text-[15px] text-stone-600 leading-relaxed pb-5 -mt-1 ${openFaq === i ? '' : 'hidden'}`}>{a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-stone-300 bg-[#F4EFE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-serif text-2xl sm:text-[32px] text-stone-900 mb-8">More guides</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {related.map((p) => (
              <Link key={p.slug} to={postPath(p)} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-[#E9E2D6]">
                  <img src={img(p.cover, 480)} onError={onImgError(p.cover)} loading="lazy" alt={p.coverAlt} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-lg leading-snug text-stone-900 mt-3 group-hover:underline underline-offset-4 decoration-1">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};

export default BlogPost;

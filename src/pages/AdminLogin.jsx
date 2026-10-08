import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

// Super Smooth & Guaranteed Scroll Reveal Component
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

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Could not connect to the configured backend. Check the API URL and server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <FadeIn direction="zoom" className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-block font-serif text-xl font-bold tracking-[0.2em] text-stone-900 uppercase mb-1">
              DIVINE HOME INDIA
            </Link>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
              B2B TRADE DESK • SECURE LOGIN
            </span>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Admin Email</label>
              <input 
                type="email" 
                required
                placeholder="admin@divinehomeindia.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-4 rounded-xl font-semibold uppercase tracking-widest transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Secure Admin Login'}
            </button>
          </form>

        </div>
      </FadeIn>
    </div>
  );
};

export default AdminLogin;
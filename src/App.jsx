import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import CursorFollower from './components/CursorFollower';
import FloatingChat from './components/FloatingChat';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import WholesaleDealers from './pages/WholesaleDealers';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

// Protected Route Wrapper for Admin Security
const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Preloader />
        <ScrollToTop />
        <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between">
          <div>
            <CursorFollower />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wholesale" element={<WholesaleDealers />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/policy/:policyType" element={<About />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Secure Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
          <Footer />
          <FloatingChat />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
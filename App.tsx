
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UIConfigProvider, useUIConfig } from './context/UIConfigContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard'; // Trang mới
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountSettings from './pages/AccountSettings';
import SupportDetailPage from './pages/SupportDetailPage';
import AdminEditSidebar from './components/AdminEditSidebar';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { isLoading, user, isAuthenticated } = useAuth();
  const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-blue-600 rounded-[32px] rotate-12 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-700 to-blue-500 rounded-[32px] shadow-2xl flex items-center justify-center transform rotate-6 animate-bounce">
            <span className="text-white font-black text-4xl italic tracking-tighter">OB</span>
          </div>
        </div>
        <div className="text-3xl font-black text-gray-900 tracking-tighter">
          Only<span className="text-blue-600">Buyer.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] max-w-[100vw] overflow-x-hidden">
      {/* Hide Navbar in Admin Panel for cleaner look */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/ho-tro/:slug" element={<SupportDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer also hidden in Admin */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UIConfigProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </CartProvider>
       </UIConfigProvider>
    </AuthProvider>
  );
};

export default App;

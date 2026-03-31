
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUIConfig } from '../context/UIConfigContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { config } = useUIConfig();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="bg-primary text-white py-1.5 px-4 text-[10px] font-semibold hidden sm:block opacity-90">
        <div className="max-w-7xl mx-auto flex justify-between">
          <div className="flex gap-4">
            <span className="hover:text-blue-100 cursor-pointer">Kênh Người Bán</span>
            <span>Kết nối: FB | IG</span>
          </div>
          <div className="flex gap-4 items-center">
            <span>Hỗ trợ 24/7: 1900 1234</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0 order-1">
            <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary rounded-xl md:rounded-2xl rotate-6 opacity-20 transition-transform group-hover:rotate-12"></div>
              <div className="absolute inset-0 bg-primary rounded-xl md:rounded-2xl shadow-lg shadow-primary"></div>
              <span className="relative text-white font-black text-lg md:text-xl italic tracking-tighter">
                {config.logoText.charAt(0)}{config.logoText.split(' ')[1]?.charAt(0) || config.logoText.charAt(1).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xl font-black text-gray-900 tracking-tighter">{config.logoText}</span>
              <span className="text-[8px] font-black text-primary uppercase tracking-widest opacity-60">Store</span>
            </div>
          </Link>

          {/* Search Bar - Chuyển xuống dưới cùng trên Mobile màn mỏng */}
          <div className="w-full md:flex-grow max-w-xl relative order-3 md:order-2 mt-2 md:mt-0">
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 py-3 md:py-3 focus:border-primary transition-all outline-none text-xs md:text-sm font-medium"
            />
            <button className="absolute right-2.5 top-2 md:top-2.5 bg-primary text-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-3 md:gap-6 order-2 md:order-3 ml-auto md:ml-0">
            <Link to="/cart" className="relative p-1.5 md:p-2 text-gray-700 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <div className="flex items-center cursor-pointer py-1 pl-3 md:pl-4 border-l border-gray-100">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center text-white font-black border-2 border-white shadow-md uppercase text-xs">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                
                <div className="absolute right-0 top-full pt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                    <Link to="/account" className="block px-4 py-2 text-[11px] text-gray-600 font-bold hover:bg-gray-50">Cài đặt hồ sơ</Link>
                    <button 
                      onClick={() => { logout(); navigate('/login'); }}
                      className="w-full text-left px-4 py-2 text-[11px] text-red-500 font-black hover:bg-red-50"
                    >
                      ĐĂNG XUẤT
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg">
                <span className="hidden sm:inline">Đăng nhập</span>
                <span className="sm:hidden">👤</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

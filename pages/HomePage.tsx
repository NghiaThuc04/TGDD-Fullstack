
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUIConfig } from '../context/UIConfigContext';
import { Product, Banner } from '../types';
import { getProductsApi } from '../services/api';
import { Link } from 'react-router-dom';
import { ROLES } from '../constants';

const BannerSlider: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeBanners = banners.filter(b => b.isActive);
  // fix: Replace NodeJS.Timeout with any for browser compatibility
  const timerRef = useRef<any>(null);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  useEffect(() => {
    if (!isPaused && activeBanners.length > 1) {
      timerRef.current = setInterval(nextSlide, 10000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeBanners.length, currentIndex]);

  if (activeBanners.length === 0) return null;

  return (
    <div 
      className="relative md:col-span-2 h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl group bg-gray-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div 
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <img 
              src={banner.image} 
              className="w-full h-full object-cover" 
              alt={banner.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex flex-col justify-center px-8 md:px-12 text-white">
              <span className="bg-primary w-fit px-4 py-1 rounded-full text-[10px] md:text-[11px] font-black tracking-widest mb-4 uppercase">
                {banner.subtitle}
              </span>
              <h2 className="text-3xl md:text-6xl font-black leading-tight whitespace-pre-line">
                {banner.title}
              </h2>
              <a 
                href={banner.ctaLink}
                className="mt-6 md:mt-8 bg-white text-primary px-8 md:px-10 py-3 md:py-4 rounded-2xl font-black w-fit hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-1 block text-center text-sm md:text-base"
              >
                {banner.ctaText}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            ←
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            →
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-12 flex gap-2 z-10">
        {activeBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 md:w-8 h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === i ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { config } = useUIConfig();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getProductsApi().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      {/* Banner Section */}
      {config.showBanner && (
        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <BannerSlider banners={config.banners} />
          
          <div className="grid grid-rows-2 gap-4 h-[450px]">
            {/* Promo Card 1 - Dynamic */}
            <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer shadow-lg opacity-90">
              <h3 className="text-2xl font-black italic whitespace-pre-line leading-tight">
                {config.promoCard1Title}
              </h3>
              <p className="text-blue-100 text-sm mt-2 font-medium">{config.promoCard1Subtitle}</p>
              <img 
                src={config.promoCard1Image} 
                className="absolute -right-8 -bottom-8 w-44 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 drop-shadow-2xl" 
                alt="Promo 1"
              />
            </div>
            
            {/* Promo Card 2 - Dynamic */}
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 flex flex-col justify-between group cursor-pointer shadow-lg">
              <div>
                <h3 className="text-2xl font-black text-gray-800 whitespace-pre-line leading-tight">
                  {config.promoCard2Title}
                </h3>
                <p className="text-primary text-sm mt-2 font-bold italic opacity-60">
                  {config.promoCard2Subtitle}
                </p>
              </div>
              <div className="flex justify-end">
                <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Dynamic Category Grid */}
      {config.showCategories && (
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 py-12">
          {config.categories.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`flex flex-col items-center gap-3 cursor-pointer group transition-all`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-sm border transition-all duration-300 overflow-hidden relative ${
                selectedCategory === cat.name 
                ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 -translate-y-2' 
                : 'bg-white border-gray-50 group-hover:border-primary group-hover:shadow-primary group-hover:shadow-xl'
              }`}>
                {cat.icon.startsWith('http') ? (
                   <img src={cat.icon} alt={cat.name} className="w-12 h-12 object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                ) : (
                   cat.icon
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${
                selectedCategory === cat.name ? 'text-primary' : 'text-gray-500 group-hover:text-primary'
              }`}>
                {cat.name}
              </span>
            </div>
          ))}
          
          {selectedCategory && (
            <div 
              onClick={() => setSelectedCategory(null)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center text-xl shadow-sm border border-gray-900 group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300 text-white font-black">
                ALL
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">HIỂN THỊ TẤT CẢ</span>
            </div>
          )}
        </div>
      )}

      {/* Main Product Showcase */}
      {config.showFeaturedProducts && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
                {selectedCategory ? `Tag: ${selectedCategory}` : 'SẢN PHẨM NỔI BẬT'}
              </h2>
              <div className="h-1.5 w-20 bg-primary mt-2 rounded-full"></div>
            </div>
            {isAuthenticated && (user?.role === ROLES.ADMIN || user?.role === ROLES.STAFF) && (
              <Link to="/admin" className="bg-gray-50 text-primary px-6 py-2.5 rounded-xl font-black text-xs hover:bg-primary hover:text-white transition-all border border-gray-100">
                TRANG QUẢN TRỊ ⚙️
              </Link>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <span className="text-6xl opacity-20 block mb-6">🔍</span>
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Chưa có sản phẩm nào cho tag này</p>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="mt-6 text-primary font-black uppercase text-xs hover:underline"
              >
                Quay lại xem tất cả
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col relative z-10">
                  <Link to={`/product/${product.slug || product.id}`} className="flex-grow">
                    <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded font-black italic shadow-sm">AUTHENTIC</span>
                        {product.sold > 1000 && <span className="bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded font-black italic shadow-sm">HOT DEAL</span>}
                        <span className="bg-gray-900/80 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded font-black italic shadow-sm uppercase">{product.category}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-70">{product.category}</span>
                      <h3 className="text-sm font-bold mt-1 line-clamp-2 text-gray-800 leading-snug h-10 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="mt-3">
                        <span className="text-lg font-black text-primary">{product.price.toLocaleString()}đ</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400 font-bold border-t pt-2">
                        <span className="flex items-center text-yellow-500">★ {product.rating}</span>
                        <span>ĐÃ BÁN {product.sold >= 1000 ? `${(product.sold/1000).toFixed(1)}K` : product.sold}</span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-4 pt-0">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-xs font-black hover:bg-primary transition-all transform active:scale-95"
                    >
                      THÊM GIỎ HÀNG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;

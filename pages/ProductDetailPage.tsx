
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByIdApi } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductByIdApi(id).then(data => {
        if (data) {
          setProduct(data);
          setActiveImage(data.image || (data.images && data.images[0]) || '');
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center text-blue-600 font-black animate-pulse">ĐANG TẢI DỮ LIỆU...</div>;
  if (!product) return <div className="p-20 text-center">SẢN PHẨM KHÔNG TỒN TẠI.</div>;

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-50 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 shadow-inner group">
            <img src={activeImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
             {galleryImages.map((img, i) => (
               <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${activeImage === img ? 'border-primary scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
               >
                 <img src={img} className="w-full h-full object-cover" alt={`view-${i}`} />
               </div>
             ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col">
          <nav className="text-[9px] font-black text-gray-400 mb-4 flex gap-2 uppercase tracking-widest">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>TRANG CHỦ</span>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors">{product.category}</span>
            <span>/</span>
            <span className="text-primary">{product.name}</span>
          </nav>
          
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-[1.2] mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
              <span className="text-yellow-600 font-black">{product.rating}</span>
              <span className="text-yellow-500 text-xs">★★★★★</span>
            </div>
            <div className="text-sm font-bold text-gray-400"><span className="text-gray-900">{product.sold.toLocaleString()}</span> ĐÃ BÁN</div>
            {user?.role === 'admin' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[9px] font-black border border-blue-200 uppercase">QUẢN TRỊ VIÊN</span>
            )}
          </div>

          <div className="p-6 bg-primary/5 rounded-2xl mb-8 flex flex-col justify-center border border-primary/10">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-primary">{product.price.toLocaleString()}đ</span>
              <span className="text-gray-400 line-through font-bold text-lg">{(product.price * 1.3).toLocaleString()}đ</span>
            </div>
            <div className="mt-3 flex gap-2">
               <span className="bg-orange-500 text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest italic">FLASH SALE -30%</span>
               <span className="bg-primary text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest italic">FREESHIP EXTRA</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số lượng</span>
              <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center font-black text-lg hover:text-primary transition-colors">-</button>
                <input type="text" value={qty} readOnly className="w-10 text-center text-sm font-black bg-transparent outline-none" />
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center font-black text-lg hover:text-primary transition-colors">+</button>
              </div>
              <span className="text-[9px] font-black text-gray-300 uppercase italic">FREESHIP TOÀN QUỐC</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => addToCart(product, qty)}
                className="flex-1 border-2 border-primary text-primary py-3.5 rounded-xl font-black uppercase text-[11px] hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                🛒 THÊM VÀO GIỎ
              </button>
              <button 
                onClick={() => { addToCart(product, qty); navigate('/cart'); }}
                className="flex-[1.5] bg-primary text-white py-3.5 rounded-xl font-black uppercase text-[11px] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all transform active:scale-95"
              >
                MUA NGAY ⚡
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-100 pt-8">
            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Mô tả sản phẩm</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed font-medium whitespace-pre-line">{product.description}</p>
          </div>

          {/* ─── TECHNICAL SPECS TABLE ─── */}
          {product.specs && (
            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Thông số kỹ thuật</h3>
                <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1 transition-all">
                  Xem tất cả <span className="text-lg leading-none">›</span>
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                {(() => {
                  const parsedSpecs: { key: string; value: string }[] = [];
                  const blocks = product.specs.split(/\n\s*\n/);
                  
                  blocks.forEach(block => {
                    const lines = block.split('\n').filter(l => l.trim().length > 0);
                    if (lines.length >= 2) {
                      const key = lines[0].replace(/\t/g, '').trim();
                      const value = lines.slice(1).join('\n').replace(/\t/g, '').trim();
                      parsedSpecs.push({ key, value });
                    }
                  });

                  if (parsedSpecs.length === 0) {
                    return <p className="p-6 text-sm italic text-gray-400 font-medium">Đang cập nhật thông số kĩ thuật...</p>;
                  }

                  return parsedSpecs.map((spec, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col md:flex-row md:items-start grid-cols-1 md:grid-cols-3 gap-1 md:gap-x-0 p-4 md:px-6 md:py-4 transition-colors hover:bg-primary/5 ${
                        idx !== parsedSpecs.length - 1 ? 'border-b border-gray-100' : ''
                      } ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
                    >
                      <div className="text-[13px] md:text-sm font-bold text-gray-600 w-full md:w-1/3 shrink-0 pt-0.5">
                        {spec.key}
                      </div>
                      <div className="text-[13px] md:text-sm font-medium text-gray-800 w-full md:w-2/3 whitespace-pre-line leading-relaxed">
                        {spec.value}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
          
          {user?.role === 'admin' && (
            <div className="mt-10 p-6 border-2 border-dashed border-blue-200 rounded-[32px] bg-blue-50/50">
               <h4 className="text-xs font-black text-blue-700 mb-4 uppercase tracking-widest">QUẢN TRỊ VIÊN CONSOLE</h4>
               <div className="flex flex-wrap gap-3">
                 <button className="bg-white px-6 py-2.5 rounded-xl text-[10px] font-black border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">SỬA NỘI DUNG</button>
                 <button className="bg-red-50 px-6 py-2.5 rounded-xl text-[10px] font-black border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all">XÓA SẢN PHẨM</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

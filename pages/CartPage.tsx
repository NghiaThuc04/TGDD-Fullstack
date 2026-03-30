
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="text-8xl mb-8 opacity-20 grayscale">🛒</div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-400 font-bold mb-10 text-sm italic">Hàng ngàn deal hời đang chờ bạn khám phá. Đừng để giỏ hàng cô đơn nhé!</p>
        <Link to="/" className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all inline-block">
          TIẾP TỤC MUA SẮM ➔
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-baseline gap-4 mb-10">
         <h1 className="text-4xl font-black text-gray-900 uppercase">GIỎ HÀNG</h1>
         <span className="text-blue-600 font-black italic text-xl">({totalItems})</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 hidden md:flex font-black text-[10px] text-gray-400 uppercase tracking-widest mb-2">
             <div className="flex-grow">Sản phẩm</div>
             <div className="w-24 text-center">Đơn giá</div>
             <div className="w-32 text-center">Số lượng</div>
             <div className="w-24 text-right">Thành tiền</div>
             <div className="w-12"></div>
          </div>
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-[24px] border border-gray-100 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6 flex-grow w-full">
                <img src={item.image} className="w-24 h-32 rounded-2xl object-cover shadow-sm border border-gray-50" alt={item.name} />
                <div className="flex-grow">
                  <span className="text-[10px] font-black text-blue-500 uppercase italic mb-1 block">{item.category}</span>
                  <h3 className="font-bold text-gray-900 leading-tight text-lg line-clamp-2">{item.name}</h3>
                  <div className="md:hidden mt-2 text-blue-700 font-black">{item.price.toLocaleString()}đ</div>
                </div>
              </div>
              
              <div className="hidden md:block w-24 text-center font-bold text-gray-600">
                {item.price.toLocaleString()}đ
              </div>

              <div className="w-full md:w-32 flex justify-center">
                <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 scale-90">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-black hover:text-blue-600 transition-colors">-</button>
                  <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-black hover:text-blue-600 transition-colors">+</button>
                </div>
              </div>

              <div className="w-full md:w-24 text-right font-black text-blue-700">
                {(item.price * item.quantity).toLocaleString()}đ
              </div>

              <button onClick={() => removeFromCart(item.id)} className="p-3 text-gray-300 hover:text-red-600 transition-colors">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-blue-50/50 sticky top-24">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b border-gray-50 pb-4">TỔNG ĐƠN HÀNG</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-bold text-sm">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold text-sm">
                <span>Vận chuyển</span>
                <span className="text-blue-600 italic">FREESHIP</span>
              </div>
              <hr className="border-gray-50 my-4" />
              <div className="flex justify-between text-2xl font-black text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-blue-700">{totalPrice.toLocaleString()}đ</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-sm hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 transform active:scale-95"
            >
              TIẾN HÀNH THANH TOÁN ➔
            </button>
            <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-40">
               <span className="text-[10px] font-black uppercase">Secure Payment</span>
               <div className="flex gap-2 font-black text-[14px]">VISA · MASTER · MOMO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
